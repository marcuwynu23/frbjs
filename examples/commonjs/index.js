require("dotenv").config();
const FireRabbit = require("@marcuwynu23/frbjs");

(async () => {
	const rabbit = new FireRabbit();
	await rabbit.init(process.env.RABBIT_MQ); // Replace with your RabbitMQ URI

	const queueName = "test-queue";

	// Send a message
	await rabbit.send(queueName, { text: "Hello, RabbitMQ!" });

	// Receive a message
	try {
		const message = await rabbit.receive(queueName);
		console.log("Received message:", message);
	} catch (error) {
		console.error("Error receiving message:", error);
	}

	// Close the connection
	// await rabbit.close();
})();
