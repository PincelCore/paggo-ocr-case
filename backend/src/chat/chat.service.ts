import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class ChatService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async fazerPergunta(documentText: string, question: string): Promise<string> {
    console.log('Pergunta:', question);

    try {
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente que analisa documentos e responde perguntas sobre eles.'
          },
          {
            role: 'user',
            content: `Documento:
"""
${documentText}
"""

Pergunta: ${question}

Responda de forma clara e direta, baseando-se apenas no conteúdo do documento acima.`
          }
        ]
      });

      const answer = response.choices[0]?.message?.content || 'Sem resposta';
      console.log('Resposta gerada:', answer.substring(0, 100) + '...');
      return answer;

    } catch (error) {
      console.error('Erro ao processar pergunta:', error);
      throw new Error(`Falha ao processar pergunta: ${error.message}`);
    }
  }

  async analiseDoc(documentText: string): Promise<string> {
    console.log('Analisando doc');

    try {
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em análise de documentos.'
          },
          {
            role: 'user',
            content: `Analise este documento e forneça um resumo estruturado:

Documento:
"""
${documentText}
"""

Forneça:
1. Tipo de documento (se identificável)
2. Principais informações encontradas
3. Resumo breve (2-3 frases)`
          }
        ]
      });

      const analysis = response.choices[0]?.message?.content || 'Sem análise';
      console.log('Análise concluída');
      return analysis;

    } catch (error) {
      console.error('Erro ao analisar documento:', error);
      throw new Error(`Falha ao analisar: ${error.message}`);
    }
  }
}