const phoneNumberId = process.env.PHONE_NUMBER_ID;
const accessToken = process.env.ACCESS_TOKEN;
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendWhatsAppMessage = async (phone, message) => {
  const data = {
    messaging_product: "whatsapp",
    to: phone,
    type: "text",
    text: { body: "this is test message" }, // Ensure text is an object
  };

  const response = await axios.post(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  console.log("Message sent successfully:", response.data);
};
