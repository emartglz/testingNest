import {MigrationInterface, QueryRunner} from "typeorm";

export class fixingRoles1631127845973 implements MigrationInterface {
    name = 'fixingRoles1631127845973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user_details" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."user_details" ALTER COLUMN "name" SET NOT NULL`);
    }

}
