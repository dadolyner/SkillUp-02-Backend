import { SignUpTest } from "./auth/auth-signup";
import { LoginTest } from "./auth/auth-login";
import { ChangeInfoTest } from "./auth/auth-changeInfo";
import { ChangeProfileImageTest } from "./auth/auth-changeImage";
import { ChangePasswordTest } from "./auth/auth-changePassword";

import { ClearTables } from "./ClearTables";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmConfig } from "../src/config/config.typeorm";
import { MyInfoTest } from "./user/user-getMyInfo";

describe('Run Tests', () => {
    // AUTH TESTS
    SignUpTest();
    LoginTest();
    ChangeInfoTest();
    ChangeProfileImageTest();
    ChangePasswordTest();

    // USER TESTS
    MyInfoTest()

    // LOCATION TESTS
    

    afterAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmConfig] }).compile();
        const app: INestApplication = moduleFixture.createNestApplication();
        await app.init();
        await ClearTables();
        await app.close();
    })
})