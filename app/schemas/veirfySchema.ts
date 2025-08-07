import {z} from 'zod';

export const verifySchema=z.object({
    otp:z.string().length(11, {message: 'OTP must be exactly 11 characters long'})
})