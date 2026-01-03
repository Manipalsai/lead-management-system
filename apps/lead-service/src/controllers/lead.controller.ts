import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';

const service = new LeadService();

export const createLead = async (req: Request, res: Response) => {
  try {
    const lead = await service.createLead(req.body);
    res.status(201).json(lead);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const stage = req.query.stage as string | undefined;
    const leads = await service.getLeads(stage);
    res.json(leads);
  } catch {
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
};
