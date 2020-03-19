import { Module } from '@nestjs/common';
import { BackofficeModule } from './backoffice/backoffice.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin123456@ds046367.mlab.com:46367/7180'),
    BackofficeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
