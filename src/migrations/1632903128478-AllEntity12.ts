import {MigrationInterface, QueryRunner} from "typeorm";

export class AllEntity121632903128478 implements MigrationInterface {
    name = 'AllEntity121632903128478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`blog_nest\`.\`user\` (\`id\` char(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDelete\` tinyint NOT NULL DEFAULT 0, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstname\` varchar(255) NOT NULL DEFAULT '', \`lastname\` varchar(255) NOT NULL DEFAULT '', \`profile\` varchar(255) NOT NULL DEFAULT 'My profile', \`role\` enum ('admin', 'user') NOT NULL DEFAULT 'user', \`refreshToken\` varchar(255) NOT NULL DEFAULT '', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_nest\`.\`comment\` (\`id\` char(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDelete\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`published\` tinyint NOT NULL DEFAULT 0, \`postId\` char(36) NULL, \`userId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_nest\`.\`img_post\` (\`id\` char(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDelete\` tinyint NOT NULL DEFAULT 0, \`url\` varchar(255) NOT NULL, \`postId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_nest\`.\`tag\` (\`id\` char(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDelete\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_nest\`.\`post_entity\` (\`id\` char(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDelete\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`published\` tinyint NOT NULL DEFAULT 0, \`userId\` char(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_nest\`.\`category\` (\`id\` char(36) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`isDelete\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_nest\`.\`post_entity_tags_tag\` (\`postEntityId\` char(36) NOT NULL, \`tagId\` char(36) NOT NULL, INDEX \`IDX_30d145f2cb22c758e78c4ba74e\` (\`postEntityId\`), INDEX \`IDX_89178b840f4e5a3e7481f3e58d\` (\`tagId\`), PRIMARY KEY (\`postEntityId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_nest\`.\`post_entity_categories_category\` (\`postEntityId\` char(36) NOT NULL, \`categoryId\` char(36) NOT NULL, INDEX \`IDX_8583474aa20d036f57b1dd2a89\` (\`postEntityId\`), INDEX \`IDX_568eb30083f46289826b7edfcf\` (\`categoryId\`), PRIMARY KEY (\`postEntityId\`, \`categoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`blog_nest\`.\`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`comment\` ADD CONSTRAINT \`FK_c0354a9a009d3bb45a08655ce3b\` FOREIGN KEY (\`userId\`) REFERENCES \`blog_nest\`.\`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`img_post\` ADD CONSTRAINT \`FK_c34bda8c7157acd8748b8c4fbee\` FOREIGN KEY (\`postId\`) REFERENCES \`blog_nest\`.\`post_entity\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity\` ADD CONSTRAINT \`FK_5e32998d7ac08f573cde04fbfa5\` FOREIGN KEY (\`userId\`) REFERENCES \`blog_nest\`.\`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity_tags_tag\` ADD CONSTRAINT \`FK_30d145f2cb22c758e78c4ba74ed\` FOREIGN KEY (\`postEntityId\`) REFERENCES \`blog_nest\`.\`post_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity_tags_tag\` ADD CONSTRAINT \`FK_89178b840f4e5a3e7481f3e58d8\` FOREIGN KEY (\`tagId\`) REFERENCES \`blog_nest\`.\`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity_categories_category\` ADD CONSTRAINT \`FK_8583474aa20d036f57b1dd2a89f\` FOREIGN KEY (\`postEntityId\`) REFERENCES \`blog_nest\`.\`post_entity\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity_categories_category\` ADD CONSTRAINT \`FK_568eb30083f46289826b7edfcf2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`blog_nest\`.\`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity_categories_category\` DROP FOREIGN KEY \`FK_568eb30083f46289826b7edfcf2\``);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity_categories_category\` DROP FOREIGN KEY \`FK_8583474aa20d036f57b1dd2a89f\``);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity_tags_tag\` DROP FOREIGN KEY \`FK_89178b840f4e5a3e7481f3e58d8\``);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity_tags_tag\` DROP FOREIGN KEY \`FK_30d145f2cb22c758e78c4ba74ed\``);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`post_entity\` DROP FOREIGN KEY \`FK_5e32998d7ac08f573cde04fbfa5\``);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`img_post\` DROP FOREIGN KEY \`FK_c34bda8c7157acd8748b8c4fbee\``);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`comment\` DROP FOREIGN KEY \`FK_c0354a9a009d3bb45a08655ce3b\``);
        await queryRunner.query(`ALTER TABLE \`blog_nest\`.\`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`DROP INDEX \`IDX_568eb30083f46289826b7edfcf\` ON \`blog_nest\`.\`post_entity_categories_category\``);
        await queryRunner.query(`DROP INDEX \`IDX_8583474aa20d036f57b1dd2a89\` ON \`blog_nest\`.\`post_entity_categories_category\``);
        await queryRunner.query(`DROP TABLE \`blog_nest\`.\`post_entity_categories_category\``);
        await queryRunner.query(`DROP INDEX \`IDX_89178b840f4e5a3e7481f3e58d\` ON \`blog_nest\`.\`post_entity_tags_tag\``);
        await queryRunner.query(`DROP INDEX \`IDX_30d145f2cb22c758e78c4ba74e\` ON \`blog_nest\`.\`post_entity_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`blog_nest\`.\`post_entity_tags_tag\``);
        await queryRunner.query(`DROP TABLE \`blog_nest\`.\`category\``);
        await queryRunner.query(`DROP TABLE \`blog_nest\`.\`post_entity\``);
        await queryRunner.query(`DROP TABLE \`blog_nest\`.\`tag\``);
        await queryRunner.query(`DROP TABLE \`blog_nest\`.\`img_post\``);
        await queryRunner.query(`DROP TABLE \`blog_nest\`.\`comment\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`blog_nest\`.\`user\``);
        await queryRunner.query(`DROP TABLE \`blog_nest\`.\`user\``);
    }

}
