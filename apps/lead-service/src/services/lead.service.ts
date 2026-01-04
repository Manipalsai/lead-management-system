import { AppDataSource } from '../config/data-source';
import { Lead } from '../entities/lead.entity';
import { LeadStage } from '../entities/lead-stage.entity';
import { Notification } from '../entities/notification.entity';

export class LeadService {
  private leadRepo = AppDataSource.getRepository(Lead);
  private stageRepo = AppDataSource.getRepository(LeadStage);
  private notificationRepo = AppDataSource.getRepository(Notification);

  async createLead(data: any) {
    const stage = await this.stageRepo.findOne({
      where: { name: data.stage }
    });

    if (!stage) {
      throw new Error('Invalid lead stage');
    }

    const lead = this.leadRepo.create({
      userName: data.userName,
      companyName: data.companyName,
      title: data.title ?? '',
      contactNumber: data.contactNumber,
      email: data.email,
      comments: data.comments ?? '',
      firstContactedAt: new Date(),
      lastContactedAt: new Date(),
      stage
    });

    return this.leadRepo.save(lead);
  }

  async getLeads(stageName?: string) {
    const query = this.leadRepo
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.stage', 'stage')
      .orderBy('lead.createdAt', 'DESC');

    if (stageName && stageName !== 'ALL') {
      query.andWhere('stage.name = :stage', { stage: stageName });
    }

    return query.getMany();
  }
  async updateLead(id: string, data: any) {
    const lead = await this.leadRepo.findOne({ where: { id } });
    if (!lead) throw new Error('Lead not found');

    if (data.stage) {
      // Logic for stage update if name is passed
      const stageName = typeof data.stage === 'string' ? data.stage : data.stage.name;
      const stage = await this.stageRepo.findOne({ where: { name: stageName } });
      if (stage) {
        lead.stage = stage;
      }
    }

    if (data.userName) lead.userName = data.userName;
    if (data.companyName) lead.companyName = data.companyName;
    if (data.title !== undefined) lead.title = data.title;
    if (data.contactNumber) lead.contactNumber = data.contactNumber;
    if (data.email) lead.email = data.email;
    if (data.email) lead.email = data.email;
    if (data.comments !== undefined) lead.comments = data.comments;
    if (data.lastContactedAt) lead.lastContactedAt = new Date(data.lastContactedAt);

    // Always update last contacted if edited? Or purely explicit? 
    // Let's keep it explicit or update updatedAt automatically by ORM

    return this.leadRepo.save(lead);
  }

  async deleteLead(id: string) {
    const result = await this.leadRepo.delete(id);
    if (result.affected === 0) {
      throw new Error('Lead not found');
    }
    return { message: 'Lead deleted successfully' };
  }

  async getStats() {
    const total = await this.leadRepo.count();

    // 'New Leads' -> Leads in initial stages
    const newLeads = await this.leadRepo.count({
      where: [
        { stage: { name: 'Lead Generation' } },
        { stage: { name: 'Lead Capture' } }
      ]
    });

    // 'Converted' -> 'Lead Conversion' or 'Lead Nurturing' (High intent)
    const converted = await this.leadRepo.count({
      where: { stage: { name: 'Lead Conversion' } }
    });

    // 'Contacted' -> Leads that are NOT 'New' and NOT 'Converted'
    // This assumes any lead that has moved past 'Lead Generation'/'Lead Capture' 
    // but hasn't reached 'Lead Conversion' is being nurtured/contacted.
    // Let's verify stages:
    // Lead Tracking, Lead Qualification, Lead Distribution, Lead Nurturing --> These are all "Contacted" stages.

    const contacted = await this.leadRepo.count({
      where: [
        { stage: { name: 'Lead Tracking' } },
        { stage: { name: 'Lead Qualification' } },
        { stage: { name: 'Lead Distribution' } },
        { stage: { name: 'Lead Nurturing' } }
      ]
    });

    // Fallback if stages are named differently in DB or we want strictly calculated:
    // const contacted = total - newLeads - converted;

    return {
      total,
      newLeads,
      contacted: contacted < 0 ? 0 : contacted,
      converted
    };
  }
  async getRecentLeads(limit = 5) {
    return this.leadRepo
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.stage', 'stage')
      .orderBy('lead.createdAt', 'DESC')
      .take(limit)
      .getMany();
  }

  async getNotifications() {
    return this.notificationRepo.find({
      order: { createdAt: 'DESC' },
      take: 20
    });
  }

  async markNotificationsRead() {
    const unread = await this.notificationRepo.find({ where: { isRead: false } });
    if (unread.length > 0) {
      unread.forEach((n: any) => n.isRead = true);
      await this.notificationRepo.save(unread);
    }
    return { success: true };
  }
}
