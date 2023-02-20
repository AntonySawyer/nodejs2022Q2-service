import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1676877435677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE public.user_entity (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        login varchar NOT NULL,
        "password" varchar NOT NULL,
        "version" int4 NOT NULL,
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY (id)
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE public.artist_entity (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" text NOT NULL,
        grammy bool NOT NULL DEFAULT false,
        CONSTRAINT "PK_c6ec16b57b60c8096406808021d" PRIMARY KEY (id)
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE public.album_entity (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        name text NOT NULL,
        "year" int4 NOT NULL,
        "artistId" uuid NULL,
        CONSTRAINT "PK_319a74c2085b42849b15412a3bf" PRIMARY KEY (id),
        CONSTRAINT "FK_4aea5943406bd89eced202b012b" FOREIGN KEY ("artistId") REFERENCES public.artist_entity(id) ON DELETE SET NULL
    )`,
    );

    await queryRunner.query(
      `CREATE TABLE public.track_entity (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL,
        "artistId" uuid NULL,
        "albumId" uuid NULL,
        duration int4 NOT NULL,
        CONSTRAINT "PK_9cc0e8a743e689434dac0130098" PRIMARY KEY (id),
        CONSTRAINT "FK_3cfbf55ef8a58b6447c226d2260" FOREIGN KEY ("artistId") REFERENCES public.artist_entity(id) ON DELETE SET NULL,
        CONSTRAINT "FK_f75df6098780938c05b7a65d2ca" FOREIGN KEY ("albumId") REFERENCES public.album_entity(id) ON DELETE SET NULL
    )`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."fav_entity_type_enum" AS ENUM('artist', 'album', 'track')`,
    );

    await queryRunner.query(
      `CREATE TABLE public.fav_entity (
        id varchar NOT NULL,
        "type" public."fav_entity_type_enum" NOT NULL,
        "entityId" uuid NOT NULL,
        artist uuid NULL,
        album uuid NULL,
        track uuid NULL,
        "artistId" uuid NULL,
        "albumId" uuid NULL,
        "trackId" uuid NULL,
        CONSTRAINT "PK_6029f1d846bbd8302fc6afb3ce1" PRIMARY KEY (id, "entityId"),
        CONSTRAINT "FK_0fb12cf6e55e6536bc43db84efc" FOREIGN KEY ("trackId") REFERENCES public.track_entity(id) ON DELETE CASCADE,
        CONSTRAINT "FK_d6208a3fa2e2516cb1eb26e3327" FOREIGN KEY ("artistId") REFERENCES public.artist_entity(id) ON DELETE CASCADE,
        CONSTRAINT "FK_ff056acdea4829cead35971784e" FOREIGN KEY ("albumId") REFERENCES public.album_entity(id) ON DELETE CASCADE
    )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.user_entity`);

    await queryRunner.query(`DROP TABLE public.artist_entity`);

    await queryRunner.query(`DROP TABLE public.album_entity`);

    await queryRunner.query(`DROP TABLE public.track_entity`);

    await queryRunner.query(`DROP TABLE public.fav_entity`);

    await queryRunner.query(
      `CREATE TABLE public.user_entity_1 (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
    )`,
    );
  }
}
