import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SpidStrategy } from './spid.strategy';

@Module({
  providers: [AuthService, SpidStrategy],
  exports: [AuthService],
})
export class AuthModule {}
