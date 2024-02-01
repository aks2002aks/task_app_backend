import { createClient } from "redis";
import dotenv from "dotenv";
import { SetOptions } from "redis";

dotenv.config();
const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST_URL,
    port: process.env.REDIS_PORT as unknown as number,
  },
});

const connectRedisDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1); // Exit the process with a failure code
  }
};

const getAsync = async (key: string) => {
  try {
    const value = await client.get(key);
    return value;
  } catch (error) {
    console.error(error);
  }
};

const setAsync = async (
  key: string,
  value: number,
  mode?: string,
  duration?: number
) => {
  try {
    const options: SetOptions = {};
    if (mode && duration) {
      options.EX = duration;
    }

    const value1 = await client.set(key, value, options);
    return value1;
  } catch (error) {
    console.error(error);
  }
};

const delAsync = async (key: string) => {
  try {
    const value = await client.del(key);
  } catch (error) {
    console.error(error);
  }
};

export { connectRedisDatabase, client, getAsync, setAsync, delAsync };
