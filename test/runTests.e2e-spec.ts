import { SignUpTest } from "./auth/auth-signup";
import { LoginTest } from "./auth/auth-login";
import { ChangeInfoTest } from "./auth/auth-changeInfo";
import { ChangeProfileImageTest } from "./auth/auth-changeImage";
import { ChangePasswordTest } from "./auth/auth-changePassword";

import { ClearTables } from "./ClearTables";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmConfig } from "../src/config/config.typeorm";

describe('Run Tests', () => {
    jest.setTimeout(30000);
    SignUpTest();
    LoginTest();
    ChangeInfoTest();
    ChangeProfileImageTest();
    ChangePasswordTest();

    afterAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmConfig] }).compile();
        const app: INestApplication = moduleFixture.createNestApplication();
        await app.init();
        await ClearTables();
        await app.close();
    })
})