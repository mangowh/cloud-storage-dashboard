import { hash } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersMigrations implements MigrationInterface {
  name = 'UsersMigration1752353613628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(150) NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );

    const adminPassword = await hash('admin', 10);

    await queryRunner.query(
      `INSERT INTO "users" (
        "id", "username", "name", "email", "password", "role", "createdAt", "updatedAt"
      ) VALUES (
        uuid_generate_v4(),
        'admin',
        'Admin User',
        'admin@example.com',
        '${adminPassword}',
        'admin',
        NOW(),
        NOW()
      )`,
    );

    const userPassword = await hash('user', 10);

    await queryRunner.query(
      `INSERT INTO "users" (
        "id", "username", "name", "email", "password", "role", "createdAt", "updatedAt"
      ) VALUES (
        uuid_generate_v4(),
        'user',
        'Basic User',
        'user@example.com',
        '${userPassword}',
        'user',
        NOW(),
        NOW()
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
