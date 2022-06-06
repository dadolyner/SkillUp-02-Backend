import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { TypeOrmTestConfig } from '../../src/config/config-test.typeorm';
import { LocationModule } from '../../src/modules/location/location.module';

export const GetRandomLocationTest = () =>
    describe('[LocationController] => Get A Random Location Test', () => {
        let app: INestApplication;

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({ imports: [TypeOrmTestConfig, LocationModule] }).compile();
            app = moduleFixture.createNestApplication();
            await app.init();
        });

        afterAll(async () => { await app.close() });

        it('User successfully retrieved a random location', async () => {
            return request(app.getHttpServer())
                .get('/location/get/random')
                .set('Content-Type', 'application/json')
                .expect(200)
        })
    })