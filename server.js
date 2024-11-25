const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const cors = require('cors');
const server = http.createServer(app);

//const io = socketIo(server);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:4000", 
        methods: ["GET", "POST"]
    }
});

// Servir el archivo HTML desde la carpeta public
app.use(express.static(__dirname + '/public'));

app.use(cors()); // Habilitar CORS

// Manejar la conexión de los clientes
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar mensajes enviados por los clientes
    socket.on('message', (message) => {
        console.log('Mensaje recibido:', message);     
        // Reenviar el mensaje a todos los clientes conectados
        io.emit('message', message);

         // Escuchar eventos desde el cliente
         socket.on('notification', (message) => {
            // Emitir la notificación a todos los clientes conectados
            io.emit('notification', message);
          });
        // Enviar una notificación a todos los clientes menos al que envió el mensaje
          socket.broadcast.emit('notification', 'Nuevo mensaje recibido');
    });

    // Manejar la desconexión del cliente
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Escuchar en el puerto 4000
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

