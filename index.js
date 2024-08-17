const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const { Kafka } = require('kafkajs');
const app = express();

app.use(express.json());

// Elasticsearch client setup
const esClient = new Client({ node: 'http://elasticsearch:9200' });

// Kafka setup
const kafka = new Kafka({
    clientId: 'log-service',
    brokers: ['kafka:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'log-consumer-group' });

const runKafkaWithRetry = async (retries = 5, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            await producer.connect();
            await consumer.connect();
            await consumer.subscribe({ topic: 'logs', fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const log = JSON.parse(message.value.toString());

                    // Store the log in Elasticsearch
                    await esClient.index({
                        index: 'logs',
                        document: log,
                    });

                    console.log('Log indexed to Elasticsearch:', log);
                },
            });

            console.log('Kafka connected successfully');
            break; // Exit the loop if successful
        } catch (error) {
            console.error(`Error connecting to Kafka (attempt ${i + 1}/${retries}):`, error.message);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 2; // Exponential backoff
            } else {
                console.error('Failed to connect to Kafka after multiple attempts');
                process.exit(1); // Exit the process if all retries fail
            }
        }
    }
};

runKafkaWithRetry().catch(console.error);

// Route to receive and forward logs to Kafka
app.post('/logs', async (req, res) => {
    try {
        const log = {
            ...req.body, // Accept and forward all fields from the request body
            timestamp: new Date(), // Ensure the timestamp is always set
        };

        // Send log to Kafka topic
        await producer.send({
            topic: 'logs',
            messages: [{ value: JSON.stringify(log) }],
        });

        res.status(201).send({ message: 'Log forwarded to Kafka successfully' });
    } catch (error) {
        console.error('Error forwarding log:', error);
        res.status(500).send({ error: 'Failed to forward log' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Logging microservice is running on port ${PORT}`);
});
