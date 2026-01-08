import { Controller, Post, Get, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import {multerConfig} from '../config/multer.config';

@Controller('document')  // Rota: documentos
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  @Post('upload')  // POST pra confirma q recebeu o upload
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadDocumentos(
    @UploadedFile() file: Express.Multer.File
  ){
    console.log('Recebeu upload:', file.filename);
    return await this.documentService.processarUpload(file);
  }

  @Get('list')  // GET da lista dos docs
  async listarDocumentos() {
    console.log('Listando documentos');
    return await this.documentService.pegarDocumentos();
  }

  @Get(':id')
  async buscarDocumento(@Param('id') id: string){
    return await this.documentService.pegarDocumentoPorId(Number(id));
  }
}
