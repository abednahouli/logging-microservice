const axios = require('axios');

const actions = [
    'view',
    'add_to_cart',
    'remove_from_cart',
    'purchase',
    'rate',
    'write_review',
    'wishlist',
    'share'
];

const generateRandomLog = () => {
    const userId = `user_${Math.floor(Math.random() * 1000)}`;
    const productId = `product_${Math.floor(Math.random() * 200)}`;
    const action = actions[Math.floor(Math.random() * actions.length)];
    const timestamp = new Date().toISOString();

    const log = {
        user_id: userId,
        product_id: productId,
        action: action,
        timestamp: timestamp,
    };

    if (action === 'rate') {
        log.rating = Math.floor(Math.random() * 5) + 1;
    } else if (action === 'write_review') {
        log.review = 'This is a review';
    }

    return log;
};

const sendLogToElasticsearch = async (log) => {
    try {
        const response = await axios.post('http://localhost:9200/logs/_doc', log, {
            headers: { 'Content-Type': 'application/json' }
        });
        console.log(`Log sent: ${response.data._id}`);
    } catch (error) {
        console.error('Error sending log:', error.message);
    }
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const runLoadTest = async () => {
    console.time('Load Test Duration'); // Start timing

    // Function to run the load test
    const sendBatchRequests = async () => {
        const numRequests = getRandomInt(200, 500);
        const batch = [];

        for (let i = 0; i < numRequests; i++) {
            const log = generateRandomLog();
            batch.push(sendLogToElasticsearch(log));
        }

        await Promise.all(batch);
        console.log(`Sent ${numRequests} requests`);
    };

    // Run the load test in intervals of 30 seconds
    const interval = setInterval(async () => {
        await sendBatchRequests();
    }, 10000);

    // Stop the load test after a certain duration (e.g., 10 minutes)
    setTimeout(() => {
        clearInterval(interval);
        console.timeEnd('Load Test Duration'); // End timing and log the duration
    }, 600000); // 10 minutes = 600,000 milliseconds
};

runLoadTest();
