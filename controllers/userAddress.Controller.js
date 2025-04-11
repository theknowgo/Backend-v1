import UserAddress from "../models/UserAddress.js";

const createResponse = (status, message, data = null) => {
  return { status, message, data };
};

const addUserAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;

    if (!userId || !address) {
      return res
        .status(400)
        .json(createResponse(false, "userId and address are required"));
    }

    const coordinates = await getAddressCoordinate(address);
    if (!coordinates) {
      return res
        .status(400)
        .json(createResponse(false, "Coordinates not found"));
    }
    const newAddress = await UserAddress.create({
      userId,
      address,
      coordinates,
    });

    res
      .status(201)
      .json(createResponse(true, "Address added successfully", newAddress));
  } catch (error) {
    res.status(400).json(createResponse(false, error.message));
  }
};

const getUserAddresses = async (req, res) => {
  try {
    const addresses = await UserAddress.find({ userId: req.params.userId });
    res
      .status(200)
      .json(
        createResponse(true, "Addresses retrieved successfully", addresses)
      );
  } catch (error) {
    res.status(400).json(createResponse(false, error.message));
  }
};

const updateUserAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.params.userId;

    if (!userId || !address) {
      return res
        .status(400)
        .json(createResponse(false, "userId and address are required"));
    }

    const result = await UserAddress.updateOne(
      { userId: userId },
      { $set: { address: address } }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json(createResponse(false, "User not found or address is the same"));
    }

    res.status(200).json(createResponse(true, "Address updated successfully"));
  } catch (error) {
    console.error("Error updating address:", error);
    res
      .status(500)
      .json(createResponse(false, "Internal server error", error.message));
  }
};

// Set Default Address
const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params.addressId;
    const userAddress = UserAddress.findById({ _id: addressId });
    if (!userAddress) {
      return res.status(404).json(createResponse(false, "Address not found"));
    }

    userAddress.isDefault = !addressId.isDefault;
    await userAddress.save();
    return res
      .status(200)
      .json(createResponse(true, "Default address set successfully"));
  } catch (error) {
    res.status(500).json(createResponse(false, error.message));
  }
};

export default {
  addUserAddress,
  getUserAddresses,
  updateUserAddress,
  setDefaultAddress,
};
