
import { IncomingMessage } from "http";



export interface IIncomingMessage extends IncomingMessage {
	user?: any;
}
