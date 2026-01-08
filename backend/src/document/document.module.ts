import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { OcrModule } from 'src/ocr/ocr.module';

@Module({
  imports: [OcrModule],
  controllers: [DocumentController],
  providers: [DocumentService]
})
export class DocumentModule {}
