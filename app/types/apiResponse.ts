import { Message } from "../models/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMsgs?: boolean;
    messeges?: Array<Message>;
}