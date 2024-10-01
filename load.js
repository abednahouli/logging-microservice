const axios = require("axios");

// Log levels to simulate
const levels = ["info", "error", "warn", "debug"];

// Actions to simulate user activity
const actions = [
  "view",
  "add_to_cart",
  "remove_from_cart",
  "purchase",
  "rate",
  "write_review",
  "wishlist",
  "share",
];

// Function to generate random log entries
const generateRandomLog = () => {
  const userId = `user_${Math.floor(Math.random() * 1000)}`;
  const productId = `product_${Math.floor(Math.random() * 200)}`;
  const action = actions[Math.floor(Math.random() * actions.length)];
  const level = levels[Math.floor(Math.random() * levels.length)];
  const timestamp = new Date().toISOString();

  // Generate a message based on action and log level
  let message = `User ${userId} performed action ${action} on product ${productId}`;
  if (level === "error") {
    message = `Error: User ${userId} encountered an issue while trying to ${action}`;
  } else if (level === "warn") {
    message = `Warning: User ${userId} action ${action} was slow to respond`;
  }

  const log = {
    level: level,
    message: message,
    additionalData: {
      user: userId,
      product: productId,
      action: action,
      timestamp: timestamp,
    },
  };

  // Add additional fields based on action
  if (action === "rate") {
    log.additionalData.rating = Math.floor(Math.random() * 5) + 1;
  } else if (action === "write_review") {
    log.additionalData.review = "This is a review of the product";
  }

  return log;
};

// Function to send log to the logging microservice
const sendLog = async (log) => {
  try {
    const response = await axios.post("http://localhost:3001/logs", log, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(`Log sent: ${response.data.message}`);
  } catch (error) {
    console.error("Error sending log:", error.message);
  }
};

// Generate random integer within a range
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Load test function to simulate user actions and send logs
const runLoadTest = async () => {
  console.time("Load Test Duration"); // Start timing

  // Function to run the load test
  const sendBatchRequests = async () => {
    const numRequests = getRandomInt(200, 500); // Generate between 200 and 500 requests
    const batch = [];

    for (let i = 0; i < numRequests; i++) {
      const log = generateRandomLog();
      batch.push(sendLog(log));
    }

    await Promise.all(batch);
    console.log(`Sent ${numRequests} requests`);
  };

  // Run the load test in intervals of 10 seconds
  const interval = setInterval(async () => {
    await sendBatchRequests();
  }, 10000);

  // Stop the load test after 10 minutes
  setTimeout(() => {
    clearInterval(interval);
    console.timeEnd("Load Test Duration"); // End timing and log the duration
  }, 600000); // 10 minutes = 600,000 milliseconds
};

runLoadTest();
