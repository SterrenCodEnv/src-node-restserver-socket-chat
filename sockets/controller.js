//? socket.emit('message', "this is a test"); || Envia solo al emisor
//? socket.broadcast.emit('message', "this is a test"); || Envia a todos los clientes excepto al emisor
//? socket.broadcast.to('game').emit('message', 'nice game'); || Envia a todos los clientes en la sala de 'game' (canal) excepto al emisor
//? socket.to('game').emit('message', 'enjoy the game'); || Envia al cliente emisor, solo si están en la sala de 'game' (canal)
//? socket.broadcast.to(socketid).emit('message', 'for your eyes only'); || Envia al cliente especificado en socketid
//? io.emit('message', "this is a test"); || Envia a todos los clientes, incluido el emisor
//? io.in('game').emit('message', 'cool game'); || Envia a todos los clientes en la sala 'game' (canal), incluido el emisor
//? io.of('myNamespace').emit('message', 'gg'); || Envia a todos los clientes en el espacio de nombre 'myNamespace', incluido el emisor
//? socket.emit(); || Envia a todos los clientes conectados
//? socket.broadcast.emit(); || Envia a todos los clientes conectados excepto al emisor
//? socket.on(); || Escucha un evento, ej.: Puede ser llamado en el cliente para escuchar un evento emitido por el servidor
//? io.sockets.socket(); || Emitir a clientes específicos
//? io.sockets.emit(); || Envia a todos los clientes conectados (al igual que socket.emit)
//? io.sockets.on() ; || Conexión inicial de un cliente.

const { verifyJWT } = require('../helpers/verify-jwt');
const { ChatMessages } = require('../models/chat-messages');
const chatMessages = new ChatMessages();

const socketController = async (socket, io) => {
    const user = await verifyJWT(socket.handshake.headers['x-token']);
    if (!user) {
        return socket.disconnect();
    }

    /*
    io -> Envia a todos los clientes // Globalmente
    broadcast -> Envia a todos los clientes conectados excepto a quien emite
    emit -> Envia a todos los clientes conectados
    */

    // Agregar usuario conectado al arreglo
    chatMessages.connectUser(user);
    io.emit('active-users', chatMessages.usersArr);
    socket.emit('recibe-message', chatMessages.lastTen);

    // Conectar a sala privada (chat con mensajes privados)
    socket.join(user.id);

    // Quitar usuarios desconectados al arreglo
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user.id);
        io.emit('active-users', chatMessages.usersArr);
    });

    socket.on('send-message', ({ uid, message }) => {
        if (uid) {
            // Mensaje privado
            socket.to(uid).emit('private-message', { de: user.name, mensaje: message });
        } else {
            chatMessages.sendMesage(user.id, user.name, message);
            io.emit('recibe-message', chatMessages.lastTen);
        }
    });

}

module.exports = {
    socketController
}