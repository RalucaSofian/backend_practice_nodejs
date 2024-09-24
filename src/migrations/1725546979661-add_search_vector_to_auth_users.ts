import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSearchVectorToAuthUsers1725546979661 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            ALTER TABLE auth_users
                ADD search_vector tsvector GENERATED ALWAYS AS (
                    to_tsvector('simple', coalesce(email, '')) || ' ' ||
                    to_tsvector('simple', coalesce(name, '')) || ' ' ||
                    to_tsvector('simple', coalesce(address, '')) || ' ' ||
                    to_tsvector('simple', coalesce(phone, ''))
                ) STORED;`
        );

        await queryRunner.query(`CREATE INDEX idx_search ON auth_users USING GIN(search_vector);`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE auth_users DROP COLUMN search_vector;`);
    }
}
