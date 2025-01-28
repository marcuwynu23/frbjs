declare class FireRabbit {
    private connection;
    private channel;
    private isConnected;
    /**
     * Initialize the RabbitMQ connection and channel
     * @param uri RabbitMQ URI
     */
    init(uri: string): Promise<void>;
    /**
     * Send a message to a queue
     * @param queueName Queue name
     * @param message Message to send
     */
    send(queueName: string, message: object | string): Promise<void>;
    /**
     * Receive a message from a queue
     * @param queueName Queue name
     */
    receive(queueName: string): Promise<any>;
    /**
     * Close the RabbitMQ connection and channel
     */
    close(): Promise<void>;
}
export default FireRabbit;
