import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycVerifiedGuard } from './guards/kyc-verified.guard';
import { KYC_PROVIDER } from './providers/kyc-provider.interface';
import { SignzyProvider } from './providers/signzy.provider';
import { IdfyProvider } from './providers/idfy.provider';

@Module({
  imports: [ConfigModule],
  controllers: [KycController],
  providers: [
    KycService,
    KycVerifiedGuard,
    SignzyProvider,
    IdfyProvider,
    {
      provide: KYC_PROVIDER,
      inject: [ConfigService, SignzyProvider, IdfyProvider],
      useFactory: (config: ConfigService, signzy: SignzyProvider, idfy: IdfyProvider) => {
        const providerName = config.get<string>('kyc.provider', 'signzy');
        if (providerName === 'idfy') return idfy;
        return signzy;
      },
    },
  ],
  exports: [KycService, KycVerifiedGuard],
})
export class KycModule {}
