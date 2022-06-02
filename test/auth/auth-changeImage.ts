import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { TypeOrmConfig } from '../../src/config/config.typeorm';

import { AuthLoginCredentialsDto } from 'src/modules/auth/dto/auth-credentials-login.dto';

export const ChangeProfileImageTest = () =>
    describe('[AuthController] => Change Profile Image Test', () => {
        let app: INestApplication;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmConfig, AuthModule] }).compile();
            app = moduleFixture.createNestApplication();
            await app.init();
        });

        afterAll(async () => { await app.close() });

        it('Users profile image successfully updated', async () => {
            const userLoginParams: AuthLoginCredentialsDto = { "email": "test.test@example.com", "password": "testing12345" };
            const loginResponse: request.Response = await request(app.getHttpServer()).post('/auth/login').send(userLoginParams);
            const accessToken = loginResponse.body.accessToken;

            const userChangeProfileImage = { "image": "https://www.example.com/file/GeotaggerExample.png" }
            return request(app.getHttpServer())
                .patch('/auth/change-profile-image')
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Content-Type', 'application/json')
                .send(userChangeProfileImage)
                .expect(200)
        })
    })