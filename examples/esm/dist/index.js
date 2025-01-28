var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FireRabbit from "@marcuwynu23/frbjs";
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the RabbitMQ URI is defined
    const rabbitMQUri = process.env.RABBIT_MQ;
    if (!rabbitMQUri) {
        throw new Error("RabbitMQ URI is not defined in the environment variables.");
    }
    // Initialize FireRabbit instance
    const rabbit = new FireRabbit();
    try {
        yield rabbit.init(rabbitMQUri); // Initialize connection with RabbitMQ URI
        const queueName = "test-queue";
        // Send a message
        const messageToSend = { text: "test" };
        yield rabbit.send(queueName, messageToSend);
        console.log(`Message sent to queue "${queueName}":`, messageToSend);
        // Receive a message
        const receivedMessage = yield rabbit.receive(queueName);
        console.log("Received message:", receivedMessage);
    }
    catch (error) {
        console.error("Error:", error);
    }
    finally {
        // Close the connection
        yield rabbit.close();
        // console.log("RabbitMQ connection closed.");
    }
}))();
