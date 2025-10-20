const { Queue } = require("bullmq");
const redis = require("../redis");

const paymentQueue = new Queue("paymentQueue", {
  connection: redis,
});

module.exports = paymentQueue;
