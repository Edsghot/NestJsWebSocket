import {
    ConnectedSocket,
    MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket} from 'socket.io';

@WebSocketGateway()
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log("Client connected: "+client.id);
  }

  handleDisconnect(client: Socket) {
    console.log("client disconnected: "+client.id);
  }

  //private methods

  //se envia el mensaje a todos los conectados y al mio tambien
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data:any ){
    console.log(data);

    this.server.emit('mensajeServer', data);
  }

  //solo a ellos
  @SubscribeMessage('messageUni')
  handleMessageBro(@ConnectedSocket() client: Socket, @MessageBody() data:any ){
    console.log(data);

    client.broadcast.emit('mensajeServerUni', data)
  }
}
