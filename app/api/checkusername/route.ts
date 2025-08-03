import connectDB from "@/app/lib/connectDB";
import UserModel from "@/app/models/User";
import {z} from "zod";
import { usernameVallidation } from "@/app/schemas/signupSchema";
const UsernameCheckSchema = z.object({
    username: usernameVallidation,
})

export async function GET(request: Request) {

    await connectDB()
    try {
        const {searchParams} = new URL(request.url);
        const queryParams={
            username: searchParams.get("username")
        }
        // vallidate
        const parsedParams = UsernameCheckSchema.safeParse(queryParams);
        if(!parsedParams.success) {
           const usernameErrors= parsedParams.error.format().username?._errors || [];
            return new Response(JSON.stringify({
                success: false,
                message: usernameErrors[0] || "Invalid username"
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const {username} = parsedParams.data;
        // check if username exists
        const existingVerifiedUser=await UserModel.findOne({username,isVerified:true})
        console.log(existingVerifiedUser)
        if(existingVerifiedUser) {
            return new Response(JSON.stringify({
                success: false,
                message: "Username already exists"
            }), {
                status: 409,
            });
        }
        return new Response(JSON.stringify({
            success: true,
            message: "Username is available"
        }), {
            status: 200,
        });
        
    } catch (error) {
   console.error("Error checking username:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Internal server error"
        }), {
            status: 500,
        });
        
    }
}