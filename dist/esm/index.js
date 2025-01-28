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
    init(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uri) {
                throw new Error("RabbitMQ URI is required.");
            }
            this.connection = yield amqp.connect(uri);
            this.channel = yield this.connection.createChannel();
        });
    }
    send(queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error("RabbitMQ channel is not initialized. Call init() first.");
            }
            yield this.channel.assertQueue(queueName, { durable: true });
            const messageString = typeof message === "string" ? message : JSON.stringify(message);
            this.channel.sendToQueue(queueName, Buffer.from(messageString), { persistent: true });
        });
    }
    receive(queueName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error("RabbitMQ channel is not initialized. Call init() first.");
            }
            yield this.channel.assertQueue(queueName, { durable: true });
            return new Promise((resolve, reject) => {
                this.channel.consume(queueName, (msg) => {
                    if (msg) {
                        try {
                            const messageContent = msg.content.toString();
                            const message = JSON.parse(messageContent);
                            this.channel.ack(msg);
                            resolve(message);
                        }
                        catch (error) {
                            this.channel.nack(msg);
                            reject(error);
                        }
                    }
                }, { noAck: false }); // Explicit acknowledgment enabled
            });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                yield this.connection.close();
                console.log("RabbitMQ connection closed.");
            }
        });
    }
}
export default FireRabbit; // Default export for ESM
module.exports = FireRabbit; // CommonJS compatibility
