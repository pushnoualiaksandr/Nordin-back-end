export class ResponseMessageDto<T = void> {
    readonly message: string;
    readonly status: boolean;
    readonly payload?: T;

    constructor(message: string, status: boolean, payload?: T) {
        this.message = message;
        this.status = status;
        this.payload = payload;
    }
}
