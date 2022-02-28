import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelationshipController } from './relationship.controller';
import { RelationshipService } from './relationship.service';
import { RelationshipEntity } from './relationship.Entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RelationshipEntity])
  ],
  controllers: [RelationshipController],
  providers: [RelationshipService]
})
export class RelationshipModule {}
