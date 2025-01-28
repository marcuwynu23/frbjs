import amqp, { Channel, Connection } from "amqplib";

class FireRabbit {
	private connection!: Connection;
	private channel!: Channel;
	private isConnected: boolean = false;

	/**
	 * Initialize the RabbitMQ connection and channel
	 * @param uri RabbitMQ URI
	 */
	async init(uri: string): Promise<void> {
		if (!uri) {
			throw new Error("RabbitMQ URI is required.");
		}

		try {
			this.connection = await amqp.connect(uri);
			this.connection.on("error", (err) => {
				console.error("RabbitMQ connection error:", err);
				this.isConnected = false;
			});

			this.connection.on("close", () => {
				console.warn("RabbitMQ connection closed.");
				this.isConnected = false;
			});

			this.channel = await this.connection.createChannel();
			this.isConnected = true;
			console.log("RabbitMQ connected successfully.");
		} catch (error) {
			console.error("Failed to connect to RabbitMQ:", error);
			throw new Error("Failed to connect to RabbitMQ. Check your URI and server status.");
		}
	}

	/**
	 * Send a message to a queue
	 * @param queueName Queue name
	 * @param message Message to send
	 */
	async send(queueName: string, message: object | string): Promise<void> {
		if (!this.isConnected || !this.channel) {
			throw new Error(
				"RabbitMQ channel is not initialized or connection is lost. Call init() first."
			);
		}

		try {
			await this.channel.assertQueue(queueName, { durable: true });
			const messageString = typeof message === "string" ? message : JSON.stringify(message);
			this.channel.sendToQueue(queueName, Buffer.from(messageString), { persistent: true });
			console.log(`Message sent to queue "${queueName}":`, messageString);
		} catch (error) {
			console.error("Error sending message to RabbitMQ:", error);
			throw new Error("Failed to send message to RabbitMQ.");
		}
	}

	/**
	 * Receive a message from a queue
	 * @param queueName Queue name
	 */
	async receive(queueName: string): Promise<any> {
		if (!this.isConnected || !this.channel) {
			throw new Error(
				"RabbitMQ channel is not initialized or connection is lost. Call init() first."
			);
		}

		try {
			await this.channel.assertQueue(queueName, { durable: true });
			console.log(`Waiting for messages in queue "${queueName}"...`);

			return new Promise((resolve, reject) => {
				this.channel.consume(
					queueName,
					(msg) => {
						if (msg) {
							try {
								const messageContent = msg.content.toString();
								const message = JSON.parse(messageContent);
								this.channel.ack(msg);
								console.log(`Message received from queue "${queueName}":`, message);
								resolve(message);
							} catch (error) {
								this.channel.nack(msg);
								console.error("Error processing message from RabbitMQ:", error);
								reject(new Error("Failed to process message."));
							}
						} else {
							reject(new Error("Message was null or undefined."));
						}
					},
					{ noAck: false }
				);
			});
		} catch (error) {
			console.error("Error receiving message from RabbitMQ:", error);
			throw new Error("Failed to receive message from RabbitMQ.");
		}
	}

	/**
	 * Close the RabbitMQ connection and channel
	 */
	async close(): Promise<void> {
		try {
			if (this.channel) {
				await this.channel.close();
			}
			if (this.connection) {
				await this.connection.close();
			}
			this.isConnected = false;
			console.log("RabbitMQ connection closed.");
		} catch (error) {
			console.error("Error closing RabbitMQ connection:", error);
			throw new Error("Failed to close RabbitMQ connection.");
		}
	}
}

export default FireRabbit; // Default export for ESM
module.exports = FireRabbit; // CommonJS compatibility
