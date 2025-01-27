<div align="center">
  <h1> FireRabbit.js </h1>
</div>

<p align="center">
  <img src="https://img.shields.io/github/stars/marcuwynu23/frbjs.svg" alt="Stars Badge"/>
  <img src="https://img.shields.io/github/forks/marcuwynu23/frbjs.svg" alt="Forks Badge"/>
  <img src="https://img.shields.io/github/issues/marcuwynu23/frbjs.svg" alt="Issues Badge"/>
  <img src="https://img.shields.io/github/license/marcuwynu23/frbjs.svg" alt="License Badge"/>
</p>

**FireRabbit** is a simple, lightweight wrapper for RabbitMQ using the `amqplib` library. It simplifies sending and receiving messages with minimal configuration, making it ideal for quick integrations and scalable messaging solutions.

## Installation

Install FireRabbit via npm:

```bash
npm install firerabbit
```

## Features

- Easy connection initialization with RabbitMQ.
- Simple methods to send and receive messages.
- Handles JSON messages seamlessly.
- Graceful connection and channel closure.

## Usage

### Initialize FireRabbit

Create a new instance of the FireRabbit class and initialize the RabbitMQ connection.

```javascript
const FireRabbit = require('firerabbit');

(async () => {
  const rabbit = new FireRabbit();
  await rabbit.init('amqp://localhost');
})();
```

### Send a Message

Send a message to a specified RabbitMQ queue.

```javascript
const FireRabbit = require('firerabbit');

(async () => {
  const rabbit = new FireRabbit();
  await rabbit.init('amqp://localhost');

  const queueName = 'test-queue';
  const message = { id: 1, text: 'Hello, RabbitMQ!' };

  await rabbit.send(queueName, message);
  await rabbit.close();
})();
```

### Receive Messages

Listen to a RabbitMQ queue and process incoming messages.

```javascript
const FireRabbit = require('firerabbit');

(async () => {
  const rabbit = new FireRabbit();
  await rabbit.init('amqp://localhost');

  const queueName = 'test-queue';

  await rabbit.receive(queueName, (message) => {
    console.log('Message received:', message);
  });
})();
```

### Close the Connection

Close the RabbitMQ connection gracefully:

```javascript
await rabbit.close();
```

## Environment Variables

You can use environment variables to configure the RabbitMQ URI:

- `RABBIT_MQ_URI`: The URI for the RabbitMQ server (e.g., `amqp://localhost`).

## Error Handling

Ensure you handle errors properly, especially when initializing the connection or interacting with RabbitMQ. For example:

```javascript
try {
  await rabbit.init('amqp://localhost');
} catch (error) {
  console.error('Failed to initialize RabbitMQ:', error);
}
```

## License

FireRabbit is open-source software licensed under the [MIT License](LICENSE).

---

Happy messaging with **FireRabbit**!

