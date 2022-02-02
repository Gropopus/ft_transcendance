import { Entity } from 'typeorm';

@Entity('todo')
export class TodoEntity {
    id: string;
    name: string;
    description?: string;
}
