import {z} from 'zod';

export const verifySchema=z.object({
    otp:z.string().length(6, {message: 'OTP must be exactly 6 characters long'})
})