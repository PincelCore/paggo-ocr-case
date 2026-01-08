import { Injectable } from '@nestjs/common';
import Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
  
  async extractText(imagePath: string): Promise<string> {
    console.log('🔍 Iniciando OCR em:', imagePath);
    
    try {
      const result = await Tesseract.recognize(
        imagePath,
        'por+eng',//portugues e ingles, n sei se entendi exatamente qual será o caso de uso
         {
          logger: (info) => {
            // Log do progresso
            if (info.status === 'recognizing text') {
              console.log(`Progresso OCR: ${Math.round(info.progress * 100)}%`);
            }
          }
        }
      );
      
      const text = result.data.text.trim();
      console.log('OCR concluído!');
      console.log(text.substring(0, 100));
      
      return text;
      
    } catch (error) {
      console.error('erro no OCR:', error);
      throw new Error(`Falha ao processar OCR: ${error.message}`);
    }
  }
}