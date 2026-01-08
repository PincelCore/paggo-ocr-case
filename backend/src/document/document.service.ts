import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OcrService } from '../ocr/ocr.service'; 

@Injectable() //logica do negocio que eu defini na arquitetura da sol
export class DocumentService {
    constructor(
        private prisma: PrismaService,
        private ocrService: OcrService,
    ) {}

   async processarUpload(file: Express.Multer.File) { //antes era data:any para os testes, agora eu to colocando o multer para aceitar os uploads reais de arquivos 
        if(!file){
            throw new Error('Nenhum arquivo enviado'); // catch throw, tratamento de exceções POO
        }

        console.log('Processando arquivo: ', file.filename);

        let extractedText = ''; //n pode null, mudei para string vazia
        try{
            extractedText = await this.ocrService.extractText(file.path);
            console.log('Texto extraído com sucesso!');
        } catch (error) {
            console.error('Erro no OCR, continuando sem texto analisado: ', error.message);
        }
        
        const document = await this.prisma.document.create({
            data: {
                filename: file.filename,
                extractedText: extractedText,
            }
        });

        return {
            sucess:true,
            message: 'Arquivo salvo com sucesso!',
            document: document,
            file: { //essa struct aqui pra armazenar os nomes do arquivo, tamanho e diretorio
                originalName: file.originalname,
                savedAs: file.filename,
                size: file.size,
                path: file.filename,
            },
            ocr: {
                sucess: extractedText !== null,
                textLength: extractedText?.length || 0,
                preview: extractedText?.substring(0, 200) || 'Sem texto extraído',
            }
        };
    }
    async pegarDocumentos(){
        return await this.prisma.document.findMany({
            orderBy: {
                createdAt: 'desc',
            }
        });
    }

    async pegarDocumentoPorId(id: number){
        return await this.prisma.document.findUnique({
            where: {id: id},
        });
    }
}

