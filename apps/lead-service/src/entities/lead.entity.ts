import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { LeadStage } from './lead-stage.entity';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userName!: string;

  @Column()
  companyName!: string;

  @Column()
  contactNumber!: string;

  @Column()
  email!: string;

  @Column({ type: 'timestamp' })
  firstContactedAt!: Date;

  @Column({ type: 'timestamp' })
  lastContactedAt!: Date;

  @Column({ type: 'text', nullable: true })
  comments?: string;

  @ManyToOne(() => LeadStage, stage => stage.leads, {
    nullable: false,
    eager: true
  })
  @JoinColumn({ name: 'stageId' })
  stage!: LeadStage;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
