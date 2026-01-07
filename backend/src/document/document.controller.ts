import { Controller, Post, Get, Body } from '@nestjs/common';
import { DocumentService } from './document.service';

@Controller('document')  // Rota: documentos
export class DocumentController {
  
  constructor(private documentService: DocumentService) {}

  @Post('upload')  // POST pra confirma q recebeu o upload
  uploadDocumentos(@Body() body: any) {
    console.log('📤 Recebeu upload:', body);
    return this.documentService.processarUpload(body);
  }

  @Get('list')  // GET da lista dos docs
  listarDocumentos() {
    console.log('📋 Listando documentos');
    return this.documentService.pegarDocumentos();
  }
}
