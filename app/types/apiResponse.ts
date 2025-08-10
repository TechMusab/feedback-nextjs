import { Message } from "../models/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMsg?: boolean;
    messeges?: Array<Message>;
    data?: any;
}