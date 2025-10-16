const { Queue } = require("bullmq");
const redis = require("../config/redis");

const paymentQueue = new Queue("paymentQueue", {
  connection: redis,
});

module.exports = paymentQueue;
