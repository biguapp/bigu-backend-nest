import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { ChatService } from './chat.service';
  
  @WebSocketGateway({ cors: true })
  export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly chatService: ChatService) {}
  
    afterInit(server: Server) {
      console.log('WebSocket gateway initialized');
    }
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('sendMessage')
    async handleMessage(
      @MessageBody() data: { chatRoomId: string; senderId: string; content: string },
      @ConnectedSocket() client: Socket
    ) {
      const message = await this.chatService.createMessage(data);
      this.server.to(data.chatRoomId).emit('newMessage', message);
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() chatRoomId: string, @ConnectedSocket() client: Socket) {
      client.join(chatRoomId);
      client.emit('joinedRoom', chatRoomId);
    }
  }