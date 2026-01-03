import { AppDataSource } from '../config/data-source';
import { Lead } from '../entities/lead.entity';
import { LeadStage } from '../entities/lead-stage.entity';
import { CreateLeadDto } from '../dto/create-lead.dto';

export class LeadService {
  private leadRepo = AppDataSource.getRepository(Lead);
  private stageRepo = AppDataSource.getRepository(LeadStage);

  async createLead(data: CreateLeadDto) {
    const stage = await this.stageRepo.findOneBy({
      id: data.stageId
    });

    if (!stage) {
      throw new Error('Invalid lead stage');
    }

    const lead = this.leadRepo.create({
      ...data,
      stage
    });

    return this.leadRepo.save(lead);
  }

  async getLeads(stage?: string) {
    const qb = this.leadRepo.createQueryBuilder('lead')
      .leftJoinAndSelect('lead.stage', 'stage')
      .orderBy('lead.createdAt', 'DESC');

    if (stage) {
      qb.where('stage.name = :stage', { stage });
    }

    return qb.getMany();
  }
}
