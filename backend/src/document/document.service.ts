import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentService {//logica do negocio que eu defini na arquitetura da sol
    processarUpload(data: any) {
        return {
            sucess:true,
            message: 'Upload recebido',
            data: {
                filename: data.filename || 'unkown',
                timestamp: new Date().toISOString(),
            }
        };
    }
    pegarDocumentos(){
        return [
            {id: 1, filename: 'invoice.jpg', date: '2026-01-06' }
        ]
    }

    }

