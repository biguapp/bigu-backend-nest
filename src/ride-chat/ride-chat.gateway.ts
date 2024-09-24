import { Server } from 'socket.io';
import { RideChatService } from './ride-chat.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

@WebSocketGateway()
export class RideChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly rideChatService: RideChatService) {}

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: any,
    payload: { rideId: string; senderId: string; content: string },
  ) {
    const { rideId, senderId, content } = payload;
    await this.rideChatService.addMessage(rideId, senderId, content);

    // Broadcast para todos os participantes do chat
    this.server.to(rideId).emit('newMessage', { senderId, content });
  }

  @SubscribeMessage('joinChat')
  async handleJoinChat(client: any, payload: { rideId: string }) {
    client.join(payload.rideId); // Adiciona o cliente ao grupo da carona
  }
}
