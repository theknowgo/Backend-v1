import Order from '../models/Order.js';
import OrderDetail from '../models/OrderDetail.js';
import User from '../models/User.js';

export const notifyPartner = async (io, orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate('customerId', 'firstName lastName contactNumber')
      .populate('partnerId', 'firstName lastName contactNumber')
      .populate('orderDetailId');

    console.log('Fetched order for notification:', order);

    if (!order) {
      throw new Error('Order not found');
    }
    if (!order.customerId) throw new Error('Customer data not populated');
    if (!order.partnerId) throw new Error('Partner data not populated');
    if (!order.orderDetailId) throw new Error('Order detail data not populated');

    const notificationPayload = {
      orderId: order._id,
      customer: {
        name: `${order.customerId.firstName} ${order.customerId.lastName || ''}`,
        contact: order.customerId.contactNumber
      },
      partner: {
        name: `${order.partnerId.firstName} ${order.partnerId.lastName || ''}`,
        contact: order.partnerId.contactNumber
      },
      orderDetails: {
        startLocation: order.orderDetailId.startLocation,
        endLocation: order.orderDetailId.endLocation,
        category: order.orderDetailId.category,
        description: order.orderDetailId.description,
        situation: order.orderDetailId.situation
      },
      status: order.status,
      pricing: calculatePricing(order.orderDetailId),
      timestamp: new Date()
    };

    console.log('Emitting notification to:', order.partnerId.toString());
    io.to(order.partnerId.toString()).emit('newOrder', notificationPayload);

    return notificationPayload;
  } catch (error) {
    console.error('Error in notifyPartner:', error.message);
    throw error;
  }
};

const calculatePricing = (orderDetail) => {
  const basePrice = 10.00;
  let categoryMultiplier = 1;

  switch (orderDetail.category) {
    case 'X': categoryMultiplier = 1.0; break;
    case 'Y': categoryMultiplier = 1.5; break;
    case 'Z': categoryMultiplier = 2.0; break;
  }

  return { basePrice, categoryMultiplier, total: basePrice * categoryMultiplier };
};

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('message', (data) => {
      console.log('Received message:', data);
      let message;

      try {
        message = JSON.parse(data);
      } catch (e) {
        console.error('Invalid JSON:', data);
        return;
      }

      if (message.event === 'join' && message.userId) {
        socket.join(message.userId);
        console.log(`User ${message.userId} joined their room`);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};