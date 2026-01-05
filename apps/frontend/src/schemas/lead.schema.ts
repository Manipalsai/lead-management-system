import { z } from 'zod';
import { LEAD_STAGES } from '../constants/leadStages';

export const leadSchema = z.object({
    userName: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    companyName: z.string()
        .min(2, 'Company name is required')
        .max(100, 'Company name cannot exceed 100 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Company name can only contain letters and spaces'),
    title: z.string()
        .max(50, 'Title cannot exceed 50 characters')
        .regex(/^[a-zA-Z\s]*$/, 'Title can only contain letters and spaces')
        .optional(),
    contactNumber: z.string()
        .min(5, 'Contact number is too short')
        .max(20, 'Contact number is too long')
        .regex(/^[0-9+]+$/, 'Contact number can only contain numbers and +')
        .optional()
        .or(z.literal('')),
    email: z.string().email('Invalid email address'),
    stage: z.enum(LEAD_STAGES),
    comments: z.string().max(500, 'Comments cannot exceed 500 characters').optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
