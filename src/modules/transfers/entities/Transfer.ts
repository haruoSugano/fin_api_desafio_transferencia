import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from "uuid";

import { User } from "modules/users/entities/User";

enum OperationType {
  TRANSFER = 'transfer'
}

@Entity('transfers')
export class Transfer {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => User, user => user.transfer)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  description: string;

  @Column('decimal')
  amount: number;

  @Column({ type: 'enum', enum: OperationType})
  type: OperationType;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
