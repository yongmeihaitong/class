import Queue from "bull"
import Redis from "ioredis"

const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number.parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
}

export const redisClient = new Redis(redisOptions)

export const emailQueue = new Queue("email", {
  redis: redisOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
})

