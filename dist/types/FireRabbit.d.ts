declare class FireRabbit {
    private connection;
    private channel;
    init(uri: string): Promise<void>;
    send(queueName: string, message: object | string): Promise<void>;
    receive(queueName: string, callback: (message: any) => void): Promise<void>;
    close(): Promise<void>;
}
export default FireRabbit;
