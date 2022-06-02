import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { AuthSignUpCredentialsDto } from '../../src/modules/auth/dto/auth-credentials-signup.dto';
import { TypeOrmTestConfig } from '../../src/config/config-test.typeorm';

export const SignUpTest = () =>
    describe('[AuthController] => SignUp Test', () => {
        let app: INestApplication;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmTestConfig, AuthModule] }).compile();
            app = moduleFixture.createNestApplication();
            await app.init();
        });

        afterAll(async () => { await app.close() });

        it('User was successfully created', () => {
            const userSignUp: AuthSignUpCredentialsDto = {
                "first_name": "Test",
                "last_name": "Example",
                "email": "test.test@example.com",
                "password": "testing12345",
                "avatar": "https://www.example.com/file/GeotaggerExample.png"
            }
            return request(app.getHttpServer())
                .post('/auth/register')
                .set('Content-Type', 'application/json')
                .send(userSignUp)
                .expect(201);
        })
    })