import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthModule } from '../../src/modules/auth/auth.module';
import { AuthLoginCredentialsDto } from '../../src/modules/auth/dto/auth-credentials-login.dto';
import { GuessParameters } from '../../src/modules/location/dto/guess-parameters.dto';
import { TypeOrmConfig } from '../../src/config/config.typeorm';
import { LocationModule } from '../../src/modules/location/location.module';

export const AddGuessForLocationTest = () =>
    describe('[LocationController] => Post A Guess For A Location Test', () => {
        let app: INestApplication;
        let accessToken: string;
        let locationId: string;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmConfig, AuthModule, LocationModule] }).compile();
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

        it('User successfully retrieved a location', async () => {
            return request(app.getHttpServer())
                .get('/location/random')
                .expect(200)
                .then(response => { expect(response.body).toHaveProperty('id'); locationId = response.body.id })
        })

        it('User successfully sent a guess for a location', async () => {
            const locationParams: GuessParameters = {
                "latitude": "45.921469",
                "longitude": "14.228370"
            }
            return request(app.getHttpServer())
                .post(`/location/guess/${locationId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Content-Type', 'application/json')
                .send(locationParams)
                .expect(201)
        })
    })