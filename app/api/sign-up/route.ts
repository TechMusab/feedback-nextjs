import connectDB from "@/app/lib/connectDB";
import { NextResponse } from "next/server";
import UserModel from "@/app/models/User";
import bcrypt from "bcryptjs";
import { sendVerificatonEmail } from "@/app/lib/sendVerificatonEmail";

export async function POST(request: Request) {
    console.log("in sign-up route");
    await connectDB();
    try {
        const {username,email,password} = await request.json();
        if (!username || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const existingUser=await UserModel.findOne({ username,isVerified:true })
       const VerifyCode= Math.random().toString(36).substring(2, 15)
        if (existingUser) {
            return NextResponse.json({ error: "Username already exists" }, { status: 400 });
        }
        const existingUserByEmail=await UserModel.findOne({ email})
        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return NextResponse.json({ error: "Email already exists" }, { status: 400 });
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10);
                const expirydate= new Date();
                expirydate.setHours(expirydate.getHours() + 24);
                existingUserByEmail.password=hashedPassword;
                existingUserByEmail.VerifyCode=VerifyCode;
                existingUserByEmail.VerifyCodeExpires=expirydate;

                await existingUserByEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expirydate= new Date();
            expirydate.setHours(expirydate.getHours() + 24); 
            const newUser=new UserModel({
                username,
                email,
                password: hashedPassword,
                VerifyCode,
                VerifyCodeExpires: expirydate,
                isAcceptingMsg: true,
                isVerified: false,
            })
            await newUser.save();
            
        }
        // send Verification Email
        const emailResponse=await sendVerificatonEmail(email, username, VerifyCode);
        if (!emailResponse.success) {
            return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
        }

        return NextResponse.json({ message: "User created successfully, please check your email for verification" }, { status: 201 });

       
    }   
    catch (error) {
        console.error("Error connecting to the database:", error);
        return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
        
    }
}