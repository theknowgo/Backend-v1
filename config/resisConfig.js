import redis from "redis";

const client = redis.createClient();

client.on("error", (err) => console.error("Redis Error:", err));

const storeChatRedis = async (chatId, message) => {
  await client.lpush(`chat:${chatId}`, JSON.stringify(message));
  await client.expire(`chat:${chatId}`, 259200); // 3 days expiry
};

const getActiveChat = async (chatId) => {
  const messages = await client.lrange(`chat:${chatId}`, 0, -1);
  return messages.map((msg) => JSON.parse(msg));
};

export { storeChatRedis, getActiveChat };
