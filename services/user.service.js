import User from "../models/User.js";

export const createUser = async ({ contactNumber }) => {
  // if (!firstName || !contactNumber || !userType || !is18plus) {
  //   throw new Error("Required fields are missing");
  // }
  if (!contactNumber) {
    throw new Error("Contact fields is missing");
  }

  const user = await User.create({
    // firstName,
    // lastName,
    // is18plus,
    // userType,
    contactNumber,
  });

  return user;
};
