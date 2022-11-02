import { MigrationInterface, QueryRunner } from "typeorm";

export class firstMigration1666898584947 implements MigrationInterface {
    name = 'firstMigration1666898584947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_bebc9158e480b949565b4dc7a82" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "price" int NOT NULL, "category_id" uniqueidentifier NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_91b4f645f7fe267179af692bf09" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_4a5ee402c3f5d53ce5c768da158" DEFAULT getdate(), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_9c4e4a89e3674fc9f382d733f03" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "created_at" datetime2 NOT NULL CONSTRAINT "DF_dff2bd18e8bb11a0300d4a624c9" DEFAULT getdate(), "updated_at" datetime2 NOT NULL CONSTRAINT "DF_e302377d50550b1b13853825736" DEFAULT getdate(), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
