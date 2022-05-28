// Guesses Module
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guesses } from 'src/entities/guesses.entity';
import { GuessesController } from './guesses.controller';
import { GuessesService } from './guesses.service';

@Module({
    imports: [TypeOrmModule.forFeature([Guesses])],
    controllers: [GuessesController],
    providers: [GuessesService],
})
export class GuessesModule {}
