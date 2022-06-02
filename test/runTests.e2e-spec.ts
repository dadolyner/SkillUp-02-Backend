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
import { CreateLocationTest } from "./location/location-create";
import { GetAllLocationsTest } from "./location/location-get";
import { GetRandomLocationTest } from "./location/location-get-random";
import { GetGuessesForLocationTest } from "./location/location-get-guesses";
import { AddGuessForLocationTest } from "./location/location-guess";
import { EditLocationTest } from "./location/location-edit";
import { DeleteLocationTest } from "./location/location-delete";

describe('Running Tests', () => {
    // AUTH TESTS
    SignUpTest()
    LoginTest()
    ChangeInfoTest()
    ChangeProfileImageTest()
    ChangePasswordTest()

    // USER TESTS
    MyInfoTest()

    // LOCATION TESTS
    CreateLocationTest()
    GetAllLocationsTest()
    GetRandomLocationTest()
    GetGuessesForLocationTest()
    AddGuessForLocationTest()
    EditLocationTest()
    DeleteLocationTest()

    afterAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmConfig] }).compile()
        const app: INestApplication = moduleFixture.createNestApplication()
        await app.init()
        await ClearTables()
        await app.close()
    })
})