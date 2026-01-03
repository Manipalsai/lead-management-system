import { LeadStage } from '../constants/leadStages';

export interface Lead {
  id: string;
  userName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  firstContactedAt: string;
  lastContactedAt: string;
  stage: LeadStage;
  comments?: string;
}
