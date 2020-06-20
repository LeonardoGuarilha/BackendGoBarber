import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

// Entidade de agendamento

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  provider_id: string; // Coluna do banco de dados

  // Relacionamento
  // Passo uma função no paramentro, que seria qual o model que ele deve usar quando essa variável(provider) for chamada
  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' }) // Qual a coluna que vai identificar qual o prestador de servico do agendamento
  provider: User;

  @Column()
  user_id: string; // Coluna do banco de dados

  // Relacionamento
  // Passo uma função no paramentro, que seria qual o model que ele deve usar quando essa variável(user) for chamada
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // Qual a coluna que vai identificar qual o prestador de servico do agendamento
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Appointment;
