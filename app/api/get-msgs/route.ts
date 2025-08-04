import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import connectDB from "@/app/lib/connectDB";
import UserModel from "@/app/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await connectDB();
    const session = await getServerSession(authOptions);
    const user = session?.user as User;
    if (!session || !session.user) {
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
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user=UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: "$messages" },
            {$sort: {"messages.createdAt": -1} },
            {
                $group:{
                    _id: "$_id",
                    messages: {$push: "$messages"},
                }
            }

        ])
        if(!user || user.length===0) {
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
        return new Response(
            JSON.stringify({
                success: true,
                message: "Messages fetched successfully",
                data: user[0].messages,
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