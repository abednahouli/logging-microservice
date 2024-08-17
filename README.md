# Logging Microservice

## Overview

This project is a big data logging microservice built with Node.js, Express, Kafka, and Elasticsearch. It is designed to handle and process large volumes of log data by leveraging modern distributed systems architecture. The service receives logs, forwards them to a Kafka topic for reliable processing, and indexes them into Elasticsearch for scalable storage and efficient retrieval. Additionally, it includes a load testing script to simulate various user actions and test the system’s capacity under high load conditions.

## Features

- **Big Data Processing**: Efficiently handles large-scale log data using a distributed architecture.
- **Log Ingestion via REST API**: Receives logs through a RESTful API and forwards them to a Kafka topic.
- **Kafka Integration**: Utilizes Kafka to handle log messages, ensuring reliable delivery and processing at scale.
- **Elasticsearch Integration**: Stores and indexes the processed logs in Elasticsearch, allowing for quick search and analytics on vast datasets.
- **Load Testing**: Simulates user actions to generate log data, testing the system's performance under big data workloads.

## Project Structure

- **index.js**: The main entry point of the microservice. Sets up the Express server, connects to Kafka, and handles log ingestion and forwarding.
- **load.js**: A load testing script that generates random user actions and sends them to Elasticsearch for performance testing under big data conditions.
- **Dockerfile**: Defines the Docker image for the microservice, including all necessary dependencies.
- **docker-compose.yaml**: Configures the Docker containers for Elasticsearch, Kafka, and the microservice, enabling easy setup and deployment.
- **package.json**: Lists the project's dependencies, including Express, KafkaJS, Axios, and Elasticsearch.

## Getting Started

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd logging-microservice
   ```
2. Build and start the services using Docker Compose:
   ```bash
   docker-compose up --build
   ```
3. The microservice will be accessible at `http://localhost:3000`.

## Usage
### Sending logs
You can send logs to the microservice via a POST request to the /logs endpoint:
```bash
  curl -X POST http://localhost:3000/logs -H "Content-Type: application/json" -d '{"user_id": "user_123", "product_id": "product_456", "action": "view"}'
```
### Running Load Tests
To run the load testing script:
```bash
  node load.js
```
This will generate random user actions and send logs to Elasticsearch at regular intervals for a duration of 10 minutes, simulating a big data environment.

## Docker Main endpoints Setup
- **Elasticsearch:** Available at `http://localhost:9200`.
- **Kafka:** Kafka broker runs on `http://localhost:9092`.

## Testing and Debugging
Use the load testing script `load.js` to evaluate the system's performance under big data workloads. Logs from Kafka and Elasticsearch can be monitored to ensure proper data flow.

## Kibana
You can also use kibana to visualize some important data from your logs on `http://localhost:5601`.

## Note to consider
I had to bump docker resource usage on my local PC to use 26GB RAM. And that would only allow you to test with around 400 log requests every 10 seconds... pains of BIG-ish DATA!

## Authors
Developed by **Abed Nahouli**.
