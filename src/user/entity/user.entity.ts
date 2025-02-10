import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Role } from '../../enums/role.enums';


 // Importando o enum para a coluna `role`

@Entity('users') // Define explicitamente o nome da tabela
export class UserEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id?: number;

  @Column({ length: 63 })
  name: string;

  @Column({
    length: 127,
    unique: true, // Garante que o e-mail seja único
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: "date",
    nullable: true, // Permite que o campo `birthAt` seja opcional
  })
  birthAt?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({
    type: "enum",
    enum: Role, // Usa o enum para restringir os valores permitidos
    default: Role.USER, // Define o valor padrão como `USER`
  })
  role: Role;
}
