import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { AuthLoginCredentialsDto } from '../../src/modules/auth/dto/auth-credentials-login.dto';
import { TypeOrmConfig } from '../../src/config/config.typeorm';
import { UserModule } from '../../src/modules/user/user.module';

export const MyInfoTest = () =>
    describe('[UserController] => Get My Info Test', () => {
        let app: INestApplication;
        let accessToken: string;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmConfig, AuthModule, UserModule] }).compile();
            app = moduleFixture.createNestApplication();
            await app.init();
        });

        afterAll(async () => { await app.close() });

        it('AccessToken successfully retrieved', async () => {
            const userLogin: AuthLoginCredentialsDto = {
                "email": "test.test@example.com",
                "password": "testing123"
            }
            return request(app.getHttpServer())
                .post('/auth/login')
                .set('Content-Type', 'application/json')
                .send(userLogin)
                .expect(201)
                .then(response => { expect(response.body).toHaveProperty('accessToken'); accessToken = response.body.accessToken })
        })

        it('User successfully retrieved its information', async () => {
            return request(app.getHttpServer())
                .get('/user/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(response => {
                    const allowedFields = ['id', 'first_name', 'last_name', 'email', 'avatar', 'location', 'guess'];
                    const allowedTypes = ['string', 'string', 'string', 'string', 'string', 'object', 'object'];
                    const userInfo = response.body;

                    for (const field of allowedFields) {
                        expect(userInfo).toHaveProperty(field);
                        expect(typeof userInfo[field]).toBe(allowedTypes[allowedFields.indexOf(field)]);
                    }
                })
        })
    })