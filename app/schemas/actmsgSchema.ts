import {z} from 'zod';

export const acptmsgSchema=z.object({
    acceptMessages:z.boolean()
})