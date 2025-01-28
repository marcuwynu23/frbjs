import FireRabbit from "@marcuwynu23/frbjs";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

(async () => {
	// Ensure the RabbitMQ URI is defined
	const rabbitMQUri = process.env.RABBIT_MQ;
	if (!rabbitMQUri) {
		throw new Error("RabbitMQ URI is not defined in the environment variables.");
	}

	// Initialize FireRabbit instance
	const rabbit = new FireRabbit();

	try {
		await rabbit.init(rabbitMQUri); // Initialize connection with RabbitMQ URI

		const queueName = "test-queue";

		// Send a message
		const messageToSend = { text: "Hello World!" };
		await rabbit.send(queueName, messageToSend);
		console.log(`Message sent to queue "${queueName}":`, messageToSend);

		// Receive a message
		const receivedMessage = await rabbit.receive(queueName);
		console.log("Received message:", receivedMessage);
	} catch (error) {
		console.error("Error:", error);
	} finally {
		// Close the connection
		await rabbit.close();
		// console.log("RabbitMQ connection closed.");
	}
})();
