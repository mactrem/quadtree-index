
export default class IllegalArgumentError extends Error{

    constructor(private readonly _message: string) {
        super(_message);
        this.name = IllegalArgumentError.name;
    }

    get message(): string{
        return this._message;
    }

}