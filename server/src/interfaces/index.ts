import { Request } from "express";
import { IncomingMessage } from "http";
import { SessionData } from "express-session";

export interface IRequest extends Request {
	user?: any;
}

export interface IIncomingMessage extends IncomingMessage {
	user?: any;
}

