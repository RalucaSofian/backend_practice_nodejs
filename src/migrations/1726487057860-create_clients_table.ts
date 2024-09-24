import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateClientsTable1726487057860 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE clients (
                id            BIGSERIAL PRIMARY KEY,
                user_id       INTEGER REFERENCES auth_users(id),
                description   VARCHAR(100),
                search_vector tsvector GENERATED ALWAYS AS (
                    to_tsvector('simple', coalesce(user_id::text, '')) || ' ' ||
                    to_tsvector('simple', coalesce(description, ''))
                ) STORED
            );`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE clients`);
    }
}
