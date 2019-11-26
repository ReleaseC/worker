import { Component } from "@nestjs/common";
import { SOCKET_EVENT } from '../common/socket.interface';

@Component()
export class BasketballService {
    constructor() { }

    initService(io, socket) {
        // console.log('BasketballService initService');
    
        socket.on(SOCKET_EVENT.EVENT_BINDING, (data) => {
            // console.log('BASKETBALL_EVENT.BASKETBALL_BINDING');
            socket.join(SOCKET_EVENT.EVENT_BINDING);
        });

        socket.on(SOCKET_EVENT.EVENT_BINDING_SUCCESS, (data) => {
            // console.log('BASKETBALL_EVENT.BASKETBALL_BINDING_SUCCESS, data=' + JSON.stringify(data));
            io.to(SOCKET_EVENT.EVENT_BINDING).emit(SOCKET_EVENT.EVENT_BINDING_SUCCESS, data);
        });
    }
}