import { AppDataSource } from '../config/data-source'
import { LeadStage } from '../entities/lead-stage.entity';

export class StageService {
  private static repo = AppDataSource.getRepository(LeadStage);

  static async getStages() {
    return this.repo.find();
  }

  static async createStage(name: string) {
    const stage = this.repo.create({ name });
    return this.repo.save(stage);
  }

  static async deleteStage(id: string) {
    const stage = await this.repo.findOne({
      where: { id },
      relations: ['leads']
    });

    if (!stage) {
      throw new Error('NOT_FOUND');
    }

    if (stage.leads.length > 0) {
      throw new Error('IN_USE');
    }

    await this.repo.remove(stage);
  }
}
