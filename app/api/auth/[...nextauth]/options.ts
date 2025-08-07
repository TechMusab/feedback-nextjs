import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/app/lib/connectDB";
import UserModel from "@/app/models/User";

const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",
            credentials:{
                email: { label: "Email", type: "text", placeholder: "Enter your email" },
                password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials:any):Promise<any>{
                await connectDB();
                try {
                    console.log(credentials.identifier)
                    const user=await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user) throw new Error("No user found with the provided credentials");
                    if(!user.isVerified) 
                        throw new Error("Please verify your email before logging in");
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if(!isPasswordValid) throw new Error("Invalid password");
                    return user;

                    
                } catch (error:any) 
                {
                    throw new Error(error.message);
                    
                }

            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user._id?.toString();
                token.email = user.email;
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMsgs = user.isAcceptingMsgs;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token.id as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMsgs = token.isAcceptingMsgs as boolean;
            }
            return session;
        }

    },
    pages:{
        signIn: "/sign-in",
        error: "/auth/error"
    },
    session:{
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,

}
export default authOptions;