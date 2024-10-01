Here’s the updated **README.md** with your instructions for running **Zookeeper**, **Kafka**, and **Loki** locally:

---

# Logging Microservice

## Overview

This project is a centralized logging microservice built using **Node.js**, **Express**, **Kafka**, **Loki**, and **Grafana**. The service allows other applications to send logs via an API, and it forwards those logs to Kafka for message processing and to Loki for log storage and visualization. Grafana is used to query and visualize the logs stored in Loki.

## Features

- **Log Ingestion via REST API**: Logs can be sent to the service through a RESTful API.
- **Kafka Integration**: Logs are forwarded to Kafka to ensure reliable and scalable message processing.
- **Loki Integration**: Logs are stored in Loki, which allows for easy searching and querying of logs.
- **Grafana Integration**: Logs can be visualized and queried in real-time through Grafana dashboards.
- **Promtail Integration**: (Optional) Promtail can be used to collect and forward logs from the system to Loki.

## Requirements

- **Node.js**: Ensure Node.js is installed on your machine.
- **Kafka & Zookeeper**: Kafka and Zookeeper should be installed and running locally.
- **Loki**: Loki should be installed and running on your local machine.
- **Grafana**: Grafana should be installed and running locally to visualize the logs.
- (Optional) **Promtail**: For collecting local system logs and forwarding them to Loki.

## Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd logging-microservice
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the microservice**:
   ```bash
   node index.js
   ```

The service will be accessible at `http://localhost:3000`.

## Running the Required Services Locally

### Kafka and Zookeeper

Kafka relies on Zookeeper to manage broker metadata. If you're running the services locally, follow these steps:

1. **Start Zookeeper** (relative to your Kafka installation directory):
   ```bash
   .\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties
   ```

2. **Start Kafka Server** (again, relative to your Kafka installation directory):
   ```bash
   .\bin\windows\kafka-server-start.bat .\config\server.properties
   ```

### Loki

To run Loki locally, ensure you have a valid configuration file (e.g., `loki-config.yaml`, you can use the file put in `/samples`). Start Loki using the following command:

```bash
.\loki.exe --config.file=loki-config.yaml
```

### Grafana Setup

1. **Access Grafana** at `http://localhost:3000` and log in using the default credentials (`admin`/`admin`).
2. **Add Loki as a data source**:
   - Navigate to **Configuration** → **Data Sources** → **Add Data Source**.
   - Choose **Loki** from the list.
   - Set the URL to `http://localhost:3100` and click **Save & Test** to verify the connection.
3. **Explore Logs**:
   - Navigate to **Explore** (compass icon in the left panel).
   - Use the query `{job="log-service"}` to see logs from the logging service.

### Promtail (Optional)

If you want to collect logs from your local system using Promtail and forward them to Loki:

1. **Create a configuration file** named `promtail-config.yaml`, you can use the file put in `/samples`.

2. **Run Promtail**:
   ```bash
   promtail-windows-amd64.exe --config.file=promtail-config.yaml
   ```

## Usage

### Sending Logs to the Microservice

You can send logs to the microservice using a POST request to the `/logs` endpoint. Here's an example using `curl`:

```bash
curl -X POST http://localhost:3000/logs \
  -H "Content-Type: application/json" \
  -d '{"level": "info", "message": "This is a test log from my app", "additionalData": {"user": "admin"}}'
```

This will send a log entry with a level, message, and additional data to the microservice, which will then forward it to Kafka and Loki.

### Viewing Logs in Grafana

0. To start grafana locally, run `net start grafana` using admin.
1. **Open Grafana** at `http://localhost:3000`.
2. Navigate to **Explore**.
3. Select **Loki** as the data source.
4. Run a query such as:
   ```bash
   {job="log-service"}
   ```
   This query will display the logs sent by the logging service.

---

### Summary

To run this microservice and its dependencies locally:
1. **Start Zookeeper**: `.\bin\windows\zookeeper-server-start.bat .\config\zookeeper.properties`
2. **Start Kafka**: `.\bin\windows\kafka-server-start.bat .\config\server.properties`
3. **Start Loki**: `.\loki.exe --config.file=loki-config.yaml`

Make sure these services are running, and then start your Node.js microservice to begin receiving and processing logs!

Let me know if you need further help!