"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqplib_1 = __importDefault(require("amqplib"));
class FireRabbit {
    init(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!uri) {
                throw new Error("RabbitMQ URI is required.");
            }
            this.connection = yield amqplib_1.default.connect(uri);
            this.channel = yield this.connection.createChannel();
            console.log("RabbitMQ connected successfully.");
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
            console.log(` [x] Sent: ${messageString}`);
        });
    }
    receive(queueName, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error("RabbitMQ channel is not initialized. Call init() first.");
            }
            yield this.channel.assertQueue(queueName, { durable: true });
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
            this.channel.consume(queueName, (msg) => {
                if (msg) {
                    const messageContent = msg.content.toString();
                    const message = JSON.parse(messageContent);
                    console.log(` [x] Received:`, message);
                    callback(message);
                    this.channel.ack(msg);
                }
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
exports.default = FireRabbit; // Default export for ESM
module.exports = FireRabbit; // CommonJS compatibility
