import {MigrationInterface, QueryRunner} from "typeorm";

export class fixRoleStatus1631133721786 implements MigrationInterface {
    name = 'fixRoleStatus1631133721786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."roles" ADD "status" character varying(8) NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."roles" DROP COLUMN "status"`);
    }

}
