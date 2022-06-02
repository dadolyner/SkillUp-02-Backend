import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { TypeOrmTestConfig } from '../../src/config/config-test.typeorm';

import { AuthChangeInfoDto } from "../../src/modules/auth/dto/auth-changeInfo.dto";
import { AuthLoginCredentialsDto } from 'src/modules/auth/dto/auth-credentials-login.dto';

export const ChangeInfoTest = () =>
    describe('[AuthController] => Change User Info Test', () => {
        let app: INestApplication;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmTestConfig, AuthModule] }).compile();
            app = moduleFixture.createNestApplication();
            await app.init();
        });

        afterAll(async () => { await app.close() });

        it('Users information successfully updated', async () => {
            const userLoginParams: AuthLoginCredentialsDto = { "email": "test.test@example.com", "password": "testing12345" };
            const loginResponse: request.Response = await request(app.getHttpServer()).post('/auth/login').send(userLoginParams);
            const accessToken = loginResponse.body.accessToken;
            
            const userChangeInfo: AuthChangeInfoDto = {
                "first_name": 'Test',
                "last_name": 'Example',
                "email": "test.test@example.com"
            }
            return request(app.getHttpServer())
                .patch('/auth/change-userInfo')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Content-Type', 'application/json')
                .send(userChangeInfo)
                .expect(200)
        })
    })