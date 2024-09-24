import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuthUsersTable1724239682238 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE auth_users (
                id       BIGSERIAL PRIMARY KEY,
                email    VARCHAR(50) NOT NULL,
                password VARCHAR(256) NOT NULL,
                name     VARCHAR(50),
                address  VARCHAR(100),
                phone    VARCHAR(30)
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE auth_users`);
    }
}
