import { Controller, Post, Get, Body, Param, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import {multerConfig} from '../config/multer.config';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { fileFromPath } from 'groq-sdk';

@Controller('document')  // Rota: documentos
@UseGuards(JwtAuthGuard)
export class DocumentController {
  constructor(private documentService: DocumentService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Post('upload')// POST pra confirma q recebeu o upload
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadDocumentos(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ){
    // console.log('Recebeu upload', fileFromPath)
    console.log('Recebeu arquivo:', file.filename);
    console.log('User:', req.user.id);
    return await this.documentService.processarUpload(
      file,
      req.user.id,
    );    
  }

  @Get('list')  // GET da lista dos docs
  async listarDocumentos(@Request() req) {
    // console.log('Listando documentos do usuario: ',  req.user.id);
    return await this.documentService.pegarDocumentos(req.user.id);
  }

  @Get(':id')
  async buscarDocumento(
    @Param('id') id: string,
    @Request() req
  ) {
    return await this.documentService.pegarDocumentoPorId(
      Number(id),
      req.user.id
    );
  }
}

