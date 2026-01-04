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

export const updateLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await service.updateLead(id, req.body);
    res.json(lead);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || 'Failed to update lead',
    });
  }
};

export const deleteLead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await service.deleteLead(id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message || 'Failed to delete lead',
    });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await service.getStats();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

export const getRecentLeads = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    const leads = await service.getRecentLeads(limit);
    res.json(leads);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch recent leads' });
  }
};

export const getNotifications = async (_req: Request, res: Response) => {
  try {
    const notifications = await service.getNotifications();
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

export const markNotificationsRead = async (_req: Request, res: Response) => {
  try {
    await service.markNotificationsRead();
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to mark notifications read' });
  }
};
