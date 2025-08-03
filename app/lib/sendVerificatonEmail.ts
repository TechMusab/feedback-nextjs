import { resend } from './resend'
import {OtpEmail} from '@/emails/verificatonEmail'
import { ApiResponse } from '../types/apiResponse'

export async function sendVerificatonEmail(email:string,username:string,verifyCode:string): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from:"onboarding@resend.dev",
            to:email,
            subject:"Verify your email address",
            react: OtpEmail({ username, otp:verifyCode }),

        })
        return {
            success: true,
            message: 'Email sent successfully',
        };
        
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            message: 'Failed to send verification email'
        };
        
    }
    
}
