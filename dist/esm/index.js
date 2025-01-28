var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import amqp from "amqplib";
class FireRabbit {
    constructor() {
        this.isConnected = false;
    }
    /**
     * Initialize the RabbitMQ connection and channel
     * @param uri RabbitMQ URI
     */
    init(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uri) {
                throw new Error("RabbitMQ URI is required.");
            }
            try {
                this.connection = yield amqp.connect(uri);
                this.connection.on("error", (err) => {
                    console.error("RabbitMQ connection error:", err);
                    this.isConnected = false;
                });
                this.connection.on("close", () => {
                    console.warn("RabbitMQ connection closed.");
                    this.isConnected = false;
                });
                this.channel = yield this.connection.createChannel();
                this.isConnected = true;
                console.log("RabbitMQ connected successfully.");
            }
            catch (error) {
                console.error("Failed to connect to RabbitMQ:", error);
                throw new Error("Failed to connect to RabbitMQ. Check your URI and server status.");
            }
        });
    }
    /**
     * Send a message to a queue
     * @param queueName Queue name
     * @param message Message to send
     */
    send(queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected || !this.channel) {
                throw new Error("RabbitMQ channel is not initialized or connection is lost. Call init() first.");
            }
            try {
                yield this.channel.assertQueue(queueName, { durable: true });
                const messageString = typeof message === "string" ? message : JSON.stringify(message);
                this.channel.sendToQueue(queueName, Buffer.from(messageString), { persistent: true });
                console.log(`Message sent to queue "${queueName}":`, messageString);
            }
            catch (error) {
                console.error("Error sending message to RabbitMQ:", error);
                throw new Error("Failed to send message to RabbitMQ.");
            }
        });
    }
    /**
     * Receive a message from a queue
     * @param queueName Queue name
     */
    receive(queueName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected || !this.channel) {
                throw new Error("RabbitMQ channel is not initialized or connection is lost. Call init() first.");
            }
            try {
                yield this.channel.assertQueue(queueName, { durable: true });
                console.log(`Waiting for messages in queue "${queueName}"...`);
                return new Promise((resolve, reject) => {
                    this.channel.consume(queueName, (msg) => {
                        if (msg) {
                            try {
                                const messageContent = msg.content.toString();
                                const message = JSON.parse(messageContent);
                                this.channel.ack(msg);
                                console.log(`Message received from queue "${queueName}":`, message);
                                resolve(message);
                            }
                            catch (error) {
                                this.channel.nack(msg);
                                console.error("Error processing message from RabbitMQ:", error);
                                reject(new Error("Failed to process message."));
                            }
                        }
                        else {
                            reject(new Error("Message was null or undefined."));
                        }
                    }, { noAck: false });
                });
            }
            catch (error) {
                console.error("Error receiving message from RabbitMQ:", error);
                throw new Error("Failed to receive message from RabbitMQ.");
            }
        });
    }
    /**
     * Close the RabbitMQ connection and channel
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.channel) {
                    yield this.channel.close();
                }
                if (this.connection) {
                    yield this.connection.close();
                }
                this.isConnected = false;
                console.log("RabbitMQ connection closed.");
            }
            catch (error) {
                console.error("Error closing RabbitMQ connection:", error);
                throw new Error("Failed to close RabbitMQ connection.");
            }
        });
    }
}
export default FireRabbit; // Default export for ESM
module.exports = FireRabbit; // CommonJS compatibility
