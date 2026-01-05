import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('todos')
export class Todo {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    text!: string;

    @Column({ default: false })
    done!: boolean;

    // Ideally we would link this to a user, but for now we'll keep it simple or use a userId column if we have the info.
    // Given we are in lead-service, we might not have direct user relations setup, but we can store the userId.
    @Column({ nullable: true })
    userId!: string; // Storing UUID from auth service

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
