# Backend Assignment – RA2311003010106

## Overview

This repository contains the backend implementation for the evaluation test.

## Components

### 1. Logging Middleware

* Captures logs from the application
* Sends logs to external API

### 2. Vehicle Maintenance Scheduler

* Fetches depot and vehicle data
* Uses optimization logic (knapsack) to maximize impact within available hours

### 3. Notification System Design

* Includes system design for scalable notification service
* Covers APIs, DB design, optimization, and scaling

## Tech Stack

* Node.js
* Express.js
* Axios

## How to Run

```bash
npm install
node logging_middleware/index.js
node vehicle_maintenance_scheduler/scheduler.js
```

## Author

Tanay Burnwal
