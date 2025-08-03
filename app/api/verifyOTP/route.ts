import connectDB from "@/app/lib/connectDB";
import UserModel from "@/app/models/User";

export async function POST(request: Request) {
    await connectDB();

    try {
      const {username,code} = await request.json()
    const decodedUsername=  decodeURIComponent(username);
    const user=await UserModel.findOne({
        username: decodedUsername,
    })
    if (!user) {
        return new Response(JSON.stringify({
            success: false,
            message: "User not found"
        }), {
            status: 404,
        });
    }
    const isCodeValid = user.VerifyCode === code;
    const isCodeExpired = user.VerifyCodeExpires < new Date();
    console.log("isCodeValid", isCodeValid, "isCodeExpired", isCodeExpired);
    if (!isCodeValid || isCodeExpired) {
        return new Response(JSON.stringify({
            success: false,
            message: "Invalid or expired OTP"
        }), {
            status: 400,
        });
    }
    // Update user verification status
    user.isVerified = true;
    await user.save();
    return new Response(JSON.stringify({
        success: true,
        message: "OTP verified successfully"
    }), {
        status: 200,
    });

        
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Internal server error"
        }), {
            status: 500,
        });
        
    }

}