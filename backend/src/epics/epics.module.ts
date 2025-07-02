import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Epic } from './epic.entity';
import { EpicsController } from './epics.controller';
import { EpicsService } from './epics.service';

@Module({
  imports: [TypeOrmModule.forFeature([Epic])],
  controllers: [EpicsController],
  providers: [EpicsService],
})
export class EpicsModule {}
