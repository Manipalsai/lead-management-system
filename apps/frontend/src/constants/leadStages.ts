export const LEAD_STAGES = [
  'Lead Generation',
  'Lead Capture',
  'Lead Tracking',
  'Lead Qualification',
  'Lead Distribution',
  'Lead Nurturing',
  'Lead Conversion'
] as const;

export type LeadStage = typeof LEAD_STAGES[number];
