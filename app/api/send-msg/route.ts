import connectDB from "@/app/lib/connectDB";
import UserModel from "@/app/models/User";

import { Message } from "@/app/models/User";

export async function POST(request: Request) {
  await connectDB();
  const { username, message } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
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
    if (!user.acceptMsg) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User has not accepted messages",
        }),
        {
          status: 403,
        }
      );
    }
    const newMessage: Message = {
      content: message,
      createdAt: new Date(),
    };
    user.messages.push(newMessage);
    await user.save();
    return new Response(
      JSON.stringify({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error sending message:", error);
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
