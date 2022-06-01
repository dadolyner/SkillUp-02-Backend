import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { TypeOrmConfig } from '../../src/config/config.typeorm';

import { AuthChangeInfoDto } from "../../src/modules/auth/dto/auth-changeInfo.dto";
import { AuthLoginCredentialsDto } from 'src/modules/auth/dto/auth-credentials-login.dto';

export const ChangeInfoTest = () =>
    describe('[AuthController] => Change User Info Test', () => {
        let app: INestApplication;
        let accessToken: string;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmConfig, AuthModule] }).compile();
            app = moduleFixture.createNestApplication();
            await app.init();
        });

        afterAll(async () => { await app.close() });

        it('AccessToken successfully retrieved', async () => {
            const userLogin: AuthLoginCredentialsDto = {
                "email": "test.test@example.com",
                "password": "testing12345"
            }
            return request(app.getHttpServer())
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(userLogin)
                .expect(201)
                .then(response => { expect(response.body).toHaveProperty('accessToken'); accessToken = response.body.accessToken })
        })

        it('Users information successfully updated', async () => {
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