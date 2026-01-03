import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lead } from './lead.entity';

@Entity()
export class LeadStage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;
  /**
   * Expected values (seeded once):
   * LEAD_GENERATION
   * LEAD_CAPTURE
   * LEAD_TRACKING
   * LEAD_QUALIFICATION
   * LEAD_DISTRIBUTION
   * LEAD_NURTURING
   * LEAD_CONVERSION
   */

  @OneToMany(() => Lead, lead => lead.stage)
  leads!: Lead[];
}
