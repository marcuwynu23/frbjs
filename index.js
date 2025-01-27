const amqp = require("amqplib");

class FireRabbit {
	async init(uri) {
		try {
			if (!uri) {
				throw new Error("RabbitMQ URI is required.");
			}
			this.connection = await amqp.connect(uri);
			this.channel = await this.connection.createChannel();
			console.log("RabbitMQ connected successfully.");
		} catch (error) {
			console.error("Error initializing RabbitMQ:", error);
			throw error;
		}
	}

	async send(queueName, message) {
		try {
			if (!this.channel) {
				throw new Error("RabbitMQ channel is not initialized. Call init() first.");
			}
			await this.channel.assertQueue(queueName, { durable: true });
			const messageString = JSON.stringify(message);
			this.channel.sendToQueue(queueName, Buffer.from(messageString), { persistent: true });
			console.log(` [x] Sent: ${messageString}`);
		} catch (error) {
			console.error("Error sending message:", error);
		}
	}

	async receive(queueName, callback) {
		try {
			if (!this.channel) {
				throw new Error("RabbitMQ channel is not initialized. Call init() first.");
			}
			await this.channel.assertQueue(queueName, { durable: true });
			console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
			this.channel.consume(queueName, (msg) => {
				if (msg !== null) {
					const messageContent = msg.content.toString();
					const message = JSON.parse(messageContent);
					console.log(` [x] Received:`, message);
					callback(message);
					this.channel.ack(msg);
				}
			});
		} catch (error) {
			console.error("Error receiving messages:", error);
		}
	}

	async close() {
		try {
			if (this.connection) {
				await this.connection.close();
				console.log("RabbitMQ connection closed.");
			}
		} catch (error) {
			console.error("Error closing RabbitMQ connection:", error);
		}
	}
}

module.exports = FireRabbit;
