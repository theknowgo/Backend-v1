import Order from "../models/Order.js";
import { createResponse } from "../utils/helpers.js";
import client from "../config/redisConfig.js";
import { io } from "../server.js";
import { getAddressDistanceTime } from "../services/maps.service.js";

const createOrder = async (req, res) => {
  try {
    const {
      customerId,
      category,
      description,
      localmateId,
      currentLocation,
      locationIntrested,
      estimatedPrice,
    } = req.body;

    const [lng, lat] = locationIntrested.coordinates;
    let radius = 3;
    let nearbyMates = [];

    // Optimized geosearch: Expand radius until 9 km max
    while (nearbyMates.length === 0 && radius <= 9) {
      nearbyMates = await client.geoRadius(
        "localmates:available",
        lng,
        lat,
        radius,
        "km",
        "WITHDIST",
        "COUNT",
        5,
        "ASC" // Closest first
      );
      radius += 3;
    }

    if (nearbyMates.length === 0) {
      return res.status(400).json(
        createResponse(false, "Sorry! No nearby localmates found", {
          notified: [],
        })
      );
    }

    // Only now make external API call
    const DistanceTime = await getAddressDistanceTime(
      `${currentLocation.coordinates[0]},${currentLocation.coordinates[1]}`,
      `${locationIntrested.coordinates[0]},${locationIntrested.coordinates[1]}`
    );
    const { distance, duration } = DistanceTime[0] || {
      distance: null,
      duration: null,
    };

    const newOrder = new Order({
      customerId,
      category,
      description,
      localmateId,
      status: "Pending",
      pickupAddress: currentLocation,
      dropAddress: locationIntrested,
      fare: estimatedPrice,
    });

    await newOrder.save();

    // Use pipeline for efficient Redis fetch
    const socketPipeline = client.multi();
    for (const [mateId] of nearbyMates) {
      socketPipeline.hGet("socketMap", mateId);
    }
    const socketIds = await socketPipeline.exec();

    for (let i = 0; i < nearbyMates.length; i++) {
      const [mateId] = nearbyMates[i];
      const socketId = socketIds[i];

      if (socketId) {
        io.to(socketId).emit("new-order", {
          orderId: newOrder._id,
          estimatedPrice,
          description,
          currentLocation,
          locationIntrested,
          ETA: duration,
          distance,
          category,
        });

        console.log(
          `📦 Sent order Notification to ${mateId} (Socket: ${socketId})`
        );
      }
    }

    return res
      .status(201)
      .json(
        createResponse(true, "Order created and requested to nearby localmates")
      );
  } catch (error) {
    console.error("Order creation failed:", error.message);
    return res.status(400).json(createResponse(false, error.message, null));
  }
};

const acceptOrder = async (req, res) => {
  const { orderId } = req.params;
  const localmateId = req.user;

  const lockKey = `order:lock:${orderId}`;

  const result = await client.set(lockKey, localmateId, {
    NX: true,
    EX: 30,
  });

  if (!result) {
    return res
      .status(409)
      .json(createResponse(false, "Order already taken", null));
  }

  await Order.findOneAndUpdate(
    { _id: orderId, status: "Pending" },
    { localmateId, status: "Ongoing", acceptedAt: new Date() },
    { new: true }
  );
  // Remove the localmate from the available list as they have accepted the order
  await client.zRem("localmates:available", localmateId);

  return res
    .status(200)
    .json(createResponse(true, "Order accepted", { orderId }));
};

const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const localmateId = req.user;

    // Step 1: Fetch and validate the order
    const order = await Order.findOne({ _id: orderId, localmateId });

    if (!order) {
      return res
        .status(404)
        .json(createResponse(false, "Order not found or unauthorized", null));
    }

    if (order.status === "Completed") {
      return res
        .status(400)
        .json(createResponse(false, "Order already completed", null));
    }

    // Step 2: Update the order status
    order.status = "Completed";
    order.completedAt = new Date(); // Optional field for record
    await order.save();

    // Step 3: Add localmate back to availability
    const [lng, lat] = order.dropAddress.coordinates;
    await client.geoAdd("localmates:available", {
      longitude: lng,
      latitude: lat,
      member: localmateId,
    });

    return res
      .status(200)
      .json(createResponse(true, "Order marked as completed", order));
  } catch (error) {
    console.error("❌ Error completing order:", error.message);
    return res
      .status(500)
      .json(createResponse(false, "Failed to complete order", null));
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate("customerId")
      .populate("partnerId")
      .populate("orderDetailId");
    if (!order) {
      return res
        .status(404)
        .json(createResponse(false, "Order not found", null));
    }
    res.status(200).json(createResponse(true, "Order found", order));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("orderDetailId");
    res.status(200).json(createResponse(true, "Orders found", orders));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};
const listOrdersByUserID = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return res
        .status(400)
        .json(createResponse(false, "Invalid or missing userId", null));
    }

    const orders = await Order.find({ customerId: userId });
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json(createResponse(false, "No orders found for this user", null));
    }
    res
      .status(200)
      .json(createResponse(true, "Orders found by userID", orders));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

const toggleFevOrder = async (req, res) => {
  try {
    const { orderId } = req.params.orderId;
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res
        .status(404)
        .json(createResponse(false, "Order not found", null));
    }

    order.isFev = !order.isFev;
    await order.save();

    res.status(200).json(createResponse(true, "Order marked as Toggled", null));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message, null));
  }
};

export default {
  createOrder,
  getOrder,
  toggleFevOrder,
  listOrdersByUserID,
  listOrders,
  acceptOrder,
};
