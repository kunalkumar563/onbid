import { Global, Module } from '@nestjs/common';
import { StorageController } from './storage.controller';
import { R2Service } from './r2.service';

// @Global: every module that handles photos (listings, verification, and
// shipping later) needs R2Service, and none of them should have to import
// this module explicitly just to get an infra client — same pattern as
// PrismaModule/RedisModule.
@Global()
@Module({
  controllers: [StorageController],
  providers: [R2Service],
  exports: [R2Service],
})
export class StorageModule {}
