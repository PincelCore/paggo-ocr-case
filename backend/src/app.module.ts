import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DocumentModule } from './document/document.module';
import { OcrModule } from './ocr/ocr.module';
import { ChatModule } from './chat/chat.module'; 
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    DocumentModule,
    OcrModule,
    ChatModule,
    AuthModule,  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}