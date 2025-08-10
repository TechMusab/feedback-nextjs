import connectDB from "@/app/lib/connectDB";
import UserModel from "@/app/models/User";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  await connectDB();
  
  try {
    const user = await UserModel.findOne({ username: params.username })
      .select("username isAcceptingMsg isVerified");
    
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

    if (!user.isVerified) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not verified",
        }),
        {
          status: 404,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          username: user.username,
          isAcceptingMsg: user.isAcceptingMsg,
        },
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
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