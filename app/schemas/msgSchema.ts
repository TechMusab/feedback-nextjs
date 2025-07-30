import {z} from 'zod';

export const msgSchema=z.object({
    content: z.string().min(1, {message: 'Message content cannot be empty'}).max(500, {message: 'Message content must be at most 500 characters long'}),
})