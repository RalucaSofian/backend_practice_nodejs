import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFosterTable1726744464054 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE foster (
                id            BIGSERIAL PRIMARY KEY,
                user_id       INTEGER REFERENCES auth_users(id),
                description   VARCHAR(100),
                pet_id        INTEGER REFERENCES pets(id) NOT NULL,
                start_date    DATE NOT NULL,
                end_date      DATE,
                search_vector tsvector GENERATED ALWAYS AS (
                    to_tsvector('simple', coalesce(description, ''))
                ) STORED
            );`
        );

        await queryRunner.query(`CREATE INDEX idx_foster_search ON foster USING GIN(search_vector);`);

        // Missing from previous migration
        await queryRunner.query(`CREATE INDEX idx_clients_search ON clients USING GIN(search_vector);`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE foster`);
    }
}
