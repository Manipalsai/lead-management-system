import { z } from 'zod';
import { LEAD_STAGES } from '../constants/leadStages';

export const leadSchema = z.object({
    userName: z.string().min(2, 'Name must be at least 2 characters'),
    companyName: z.string().min(2, 'Company name is required'),
    title: z.string().optional(),
    contactNumber: z.string().min(5, 'Contact number is invalid').optional().or(z.literal('')),
    email: z.string().email('Invalid email address'),
    stage: z.enum(LEAD_STAGES),
    comments: z.string().optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
