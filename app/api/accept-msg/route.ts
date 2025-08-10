import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";
import connectDB from "@/app/lib/connectDB";
import UserModel from "@/app/models/User";
import { User } from "next-auth";
export async function POST(request: Request) {
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
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMsg: acceptMessages,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) {
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
        message: "Accept message updated successfully",
        isAcceptingMsg: updatedUser.isAcceptingMsg,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating accept message:", error);
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
  const userId = user._id;
  try {
    const userDoc = await UserModel.findById(userId).select("isAcceptingMsg");
    if (!userDoc) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMsg: userDoc.isAcceptingMsg,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching accept message:", error);
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
