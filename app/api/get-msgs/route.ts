import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import connectDB from "@/app/lib/connectDB";
import UserModel from "@/app/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const sessionUser = session?.user as User;
    if (!session || !sessionUser) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Unauthorized",
            }),
            {
                status: 401,
            }
        );
    }
    const userId = new mongoose.Types.ObjectId(sessionUser._id);
    try {
        // First check if user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                }),
                {
                    status: 404,
                }
            );
        }

        // If user has no messages, return empty array
        if (!user.messages || user.messages.length === 0) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "Messages fetched successfully",
                    messeges: [],
                }),
                {
                    status: 200,
                }
            );
        }

        // If user has messages, sort them by createdAt
        const sortedMessages = user.messages.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        return new Response(
            JSON.stringify({
                success: true,
                message: "Messages fetched successfully",
                messeges: sortedMessages,
            }),
            {
                status: 200,
            }
        );
        
    } catch (error) {
        console.error("Error fetching messages:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal server error",
            }),
            {
                status: 500,
            }
        );
        
    }
}