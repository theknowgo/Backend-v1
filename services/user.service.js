import User from "../models/User.js";

export const createUser = async ({
  firstName,
  lastName,
  is18plus,
  userType,
  contactNumber,
}) => {
  if (!firstName || !contactNumber || !userType || !is18plus) {
    throw new Error("Required fields are missing");
  }

  const user = await User.create({
    firstName,
    lastName,
    is18plus,
    userType,
    contactNumber,
  });

  return user;
};
