import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePetsTable1726053119618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(
            `CREATE TABLE pets (
                id            BIGSERIAL PRIMARY KEY,
                name          VARCHAR(50) NOT NULL,
                species       VARCHAR(50),
                gender        VARCHAR(5),
                age           REAL,
                description   VARCHAR(100),
                search_vector tsvector GENERATED ALWAYS AS (
                    to_tsvector('simple', coalesce(name, '')) || ' ' ||
                    to_tsvector('simple', coalesce(species, '')) || ' ' ||
                    to_tsvector('simple', coalesce(gender, '')) || ' ' ||
                    to_tsvector('simple', coalesce(age::text, '')) || ' ' ||
                    to_tsvector('simple', coalesce(description, ''))
                ) STORED
            );`
        );

        await queryRunner.query(`CREATE INDEX idx_pet_search ON pets USING GIN(search_vector);`);
    }


    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE pets`);
    }
}
