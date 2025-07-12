import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'bonusx_db',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
