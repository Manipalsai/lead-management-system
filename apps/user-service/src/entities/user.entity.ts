import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: ['SUPER_ADMIN', 'ADMIN', 'USER'],
    default: 'USER',
  })
  role!: UserRole;
}
