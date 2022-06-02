import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { TypeOrmTestConfig } from '../../src/config/config-test.typeorm';
import { LocationModule } from '../../src/modules/location/location.module';

export const GetAllLocationsTest = () =>
    describe('[LocationController] => Get All Locations Test', () => {
        let app: INestApplication;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmTestConfig, LocationModule] }).compile();
            app = moduleFixture.createNestApplication();
            await app.init();
        });

        afterAll(async () => { await app.close() });

        it('User successfully retrieved all locations', async () => {
            return request(app.getHttpServer())
                .get('/location')
                .set('Content-Type', 'application/json')
                .expect(200)
        })
    })