import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private prisma: PrismaService,
  ) {}

  @Post('ask')
  async fazerPergunta(@Body() body: { documentId: number; question: string }) {
    console.log('POST /chat/ask', body);

    const document = await this.prisma.document.findUnique({ //buscar doc no bd
      where: { id: body.documentId },
    });

    if (!document) {
      return { error: 'Documento não encontrado' };
    }

    if (!document.extractedText) {
      return { error: 'Documento não tem texto extraído' };
    }

    // faz pergunta ao claude
    const answer = await this.chatService.fazerPergunta(
      document.extractedText,
      body.question
    );

    // salvar pergunta e resposta no banco
    const chat = await this.prisma.chat.create({
      data: {
        documentId: body.documentId,
        question: body.question,
        answer: answer,
      }
    });

    return {
      success: true,
      question: body.question,
      answer: answer,
      chatId: chat.id,
    };
  }

  @Get('history/:documentId') //funcao do requisito de historico do chat
  async getChatHistory(@Param('documentId') documentId: string) {
    console.log('GET /chat/history/' + documentId);

    const chats = await this.prisma.chat.findMany({
      where: { documentId: Number(documentId) },
      orderBy: { createdAt: 'asc' },
    });

    return chats;
  }

  @Post('analyze/:documentId') //mesma coisa do Post do ask, mas para a funcao extra que criei de resumo de doc
  async analiseDoc(@Param('documentId') documentId: string) {
    console.log('POST /chat/analyze/' + documentId);

    const document = await this.prisma.document.findUnique({
      where: { id: Number(documentId) },
    });

    if (!document || !document.extractedText) {
      return { error: 'Documento não encontrado ou sem texto' };
    }

    const analysis = await this.chatService.analiseDoc(
      document.extractedText
    );

    return {
      success: true,
      documentId: document.id,
      analysis: analysis,
    };
  }
}