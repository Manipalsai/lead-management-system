import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { StageService } from '../services/stage.service';

export class StageController {
  static async getAll(req: AuthRequest, res: Response) {
    const stages = await StageService.getStages();
    return res.json(stages);
  }

  static async create(req: AuthRequest, res: Response) {
    if (req.user!.role === 'USER') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Stage name required' });
    }

    const stage = await StageService.createStage(name);
    return res.status(201).json(stage);
  }

  static async delete(req: AuthRequest, res: Response) {
    if (req.user!.role === 'USER') {
      return res.status(403).json({ message: 'Access denied' });
    }

    try {
      await StageService.deleteStage(req.params.id);
      return res.status(204).send();
    } catch (e: any) {
      if (e.message === 'IN_USE') {
        return res
          .status(400)
          .json({ message: 'Cannot delete stage with existing leads' });
      }
      return res.status(404).json({ message: 'Stage not found' });
    }
  }
}
