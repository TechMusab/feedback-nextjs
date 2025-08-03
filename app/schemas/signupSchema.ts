import {z} from 'zod';

export const usernameVallidation=z.string().min(2, {message: 'Username must be at least 2 characters long'}).max(15, {message: 'Username must be at most 15 characters long'}).regex(/^[a-zA-Z0-9_]+$/, {message: 'Username can only contain letters, numbers, and underscores'})

export const signupSchema = z.object({
    username: usernameVallidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}).max(50, {message: 'Password must be at most 50 characters long'}),
})