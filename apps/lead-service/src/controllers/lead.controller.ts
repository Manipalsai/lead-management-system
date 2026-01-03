import { Request, Response } from 'express';
import { LeadService } from '../services/lead.service';

const service = new LeadService();

/**
 * CREATE LEAD
 */
export const createLead = async (req: Request, res: Response) => {
  try {
    const lead = await service.createLead(req.body);

    // Ensure relation is returned
    res.status(201).json(lead);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || 'Failed to create lead',
    });
  }
};

/**
 * GET ALL LEADS (optional stage filter)
 * /leads?stage=Lead%20Tracking
 */
export const getLeads = async (req: Request, res: Response) => {
  try {
    const stage = req.query.stage as string | undefined;
    const leads = await service.getLeads(stage);

    res.json(leads);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch leads',
    });
  }
};
