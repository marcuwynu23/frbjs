import amqp, { Channel, Connection } from "amqplib";

class FireRabbit {
	private connection!: Connection;
	private channel!: Channel;

	async init(uri: string): Promise<void> {
		if (!uri) {
			throw new Error("RabbitMQ URI is required.");
		}
		this.connection = await amqp.connect(uri);
		this.channel = await this.connection.createChannel();
		console.log("RabbitMQ connected successfully.");
	}

	async send(queueName: string, message: object | string): Promise<void> {
		if (!this.channel) {
			throw new Error("RabbitMQ channel is not initialized. Call init() first.");
		}
		await this.channel.assertQueue(queueName, { durable: true });
		const messageString = typeof message === "string" ? message : JSON.stringify(message);
		this.channel.sendToQueue(queueName, Buffer.from(messageString), { persistent: true });
		console.log(` [x] Sent: ${messageString}`);
	}

	async receive(queueName: string): Promise<any> {
		if (!this.channel) {
			throw new Error("RabbitMQ channel is not initialized. Call init() first.");
		}
		await this.channel.assertQueue(queueName, { durable: true });
		console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);

		return new Promise((resolve, reject) => {
			this.channel.consume(
				queueName,
				(msg) => {
					if (msg) {
						try {
							const messageContent = msg.content.toString();
							const message = JSON.parse(messageContent);
							console.log(` [x] Received:`, message);
							this.channel.ack(msg);
							resolve(message);
						} catch (error) {
							this.channel.nack(msg);
							reject(error);
						}
					}
				},
				{ noAck: false }
			); // Explicit acknowledgment enabled
		});
	}

	async close(): Promise<void> {
		if (this.connection) {
			await this.connection.close();
			console.log("RabbitMQ connection closed.");
		}
	}
}

export default FireRabbit; // Default export for ESM
module.exports = FireRabbit; // CommonJS compatibility
