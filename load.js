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
    const userId = `user_${Math.floor(Math.random() * 50)}`;
    const productId = `product_${Math.floor(Math.random() * 20)}`;
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

const runLoadTest = async () => {
    console.time('Load Test Duration'); // Start timing
    const promises = [];
    for (let i = 0; i < 1000; i++) {
        const log = generateRandomLog();

        promises.push(sendLogToElasticsearch(log));
    }
    await Promise.all(promises);
    console.timeEnd('Load Test Duration'); // End timing and log the duration
};

runLoadTest();
