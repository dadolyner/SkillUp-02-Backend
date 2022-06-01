import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { TypeOrmConfig } from '../../src/config/config.typeorm';

import { AuthLoginCredentialsDto } from 'src/modules/auth/dto/auth-credentials-login.dto';

export const ChangePasswordTest = () =>
    describe('[AuthController] => Change Users Password Test', () => {
        let app: INestApplication;
        let accessToken: string;
        let passRequestToken: string;

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

        it('User has successfully requested a change password token', async () => {
            return request(app.getHttpServer())
                .post('/auth/request-password-change')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(201)
                .then(response => { expect(response.body).toHaveProperty('passRequestToken'); passRequestToken = response.body.passRequestToken })
        })

        it('Users password successfully changed', async () => {
            const userChangePassword = {
                "oldPassword": "testing12345",
                "newPassword": "testing123"
            }
            return request(app.getHttpServer())
                .patch(`/auth/change-password/${passRequestToken}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Content-Type', 'application/json')
                .send(userChangePassword)
                .expect(200)
        })
    })