import { Injectable } from '@nestjs/common';
import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomUUID } from 'crypto';

@Injectable()
export class OcrService {
  
  async extractText(imagePath: string): Promise<string> {
    console.log('🔍 Iniciando OCR em:', imagePath);

    const processedImagePath = join(
      tmpdir(),
      `ocr-${randomUUID()}.png`
    );
    
    try {
      await sharp(imagePath)
        .grayscale()
        .normalize()
        .linear(1.2, -20)
        .sharpen()
        .threshold(180)
        .toFile(processedImagePath);

      const result = await Tesseract.recognize(
        processedImagePath,
        'por+eng',
        {
          logger: (info) => {
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
