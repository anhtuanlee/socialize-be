import { statusCode } from '../types/global';
import { CustomError } from './CustomError';

export default class BadRequestError extends CustomError {
    private static readonly _statusCode = 400;
    private readonly _code: number;
    private readonly _logging: boolean;
    private readonly _context: { [key: string]: any };

    constructor(params?: {
        code?: statusCode.TError;
        message?: string;
        logging?: boolean;
        context?: { [key: string]: any };
    }) {
        const { code, message, logging } = params || {};

        super(message || BadRequestError.getMessageForCode(code));
        this._code = code || BadRequestError._statusCode;
        this._logging = logging || false;
        this._context = params?.context || {};

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    private static getMessageForCode(code?: number): string {
        switch (code) {
            case 400:
                return 'Bad Request';
            case 401:
                return 'Unauthorized';
            case 403:
                return 'Resource is Forbidden!';
            case 404:
                return 'Not Found';
            default:
                return 'Bad request';
        }
    }
    get errors() {
        return [{ message: this.message, context: this._context }];
    }

    get statusCode() {
        return this._code;
    }

    get logging() {
        return this._logging;
    }
}
