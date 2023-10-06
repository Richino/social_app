import { Request } from "express";
import { IncomingMessage } from "http";

export interface IRequest extends Request {
	[x: string]: { user: any };
	user?: any;
}

export interface IIncomingMessage extends IncomingMessage {
	user?: any;
}
