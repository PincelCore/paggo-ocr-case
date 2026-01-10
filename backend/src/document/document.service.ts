import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OcrService } from '../ocr/ocr.service';

@Injectable()
export class DocumentService {
  constructor(
    private prisma: PrismaService,
    private ocrService: OcrService,
  ) {}

  async processarUpload(file: Express.Multer.File, userId: number) {
    if (!file) {
      throw new Error('Nenhum arquivo enviado!');
    }

    console.log('Processando arquivo:', file.filename);

    
    let extractedText = '';
    try {
      extractedText = await this.ocrService.extractText(file.path);
      console.log('Texto extraído com sucesso!');
    } catch (error) {
      console.error('Erro no OCR:', error.message);
    }

    
    const document = await this.prisma.document.create({
      data: {
        filename: file.filename,
        extractedText: extractedText,
        userId: userId,  
      }
    });

    return {
      success: true,
      message: 'Arquivo processado com sucesso!',
      document: document,
      file: {
        originalName: file.originalname,
        savedAs: file.filename,
        size: file.size,
        path: file.path,
      },
      ocr: {
        success: extractedText !== null,
        textLength: extractedText?.length || 0,
        preview: extractedText?.substring(0, 200) || 'Sem texto',
      }
    };
  }
//   return {
//     success: true,
//     message: 'Arquivo processado com sucesso!',
//     document: document,
//     file: {
//       originalName: file.filename,
//       savedAs: file.filename,
//       size: file.size,
//       path: file.path,
//     },
//     ocr: {
//       success: extractedText !== '',
//       textLength: extractedText?.length || 0,
//       preview: extractedText?.substring(0, 200) || 'Sem texxto',
//     }
//   };
// }

  async pegarDocumentos(userId: number) {
    return await this.prisma.document.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async pegarDocumentoPorId(id: number, userId: number) {
    const document = await this.prisma.document.findUnique({
      where: { id: id }
    });

    if (!document) {
      throw new NotFoundException('Documento não encontrado');
    }

    if (document.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este documento');
    }

    return document;
  }
}