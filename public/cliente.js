const io = require('socket.io-client');
const readline = require('readline');
const notifier = require('node-notifier');

// Conectarse al servidor Socket.io
const socket = io('http://127.0.0.1:4000'); 

// Crear una interfaz para la entrada de línea
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Escribe algo: '
});

socket.on('connect', () => {
    rl.prompt(); // Mostrar el prompt inicial
});

// Manejar mensajes recibidos del servidor sin mostrar en terminal
socket.on('message', (message) => {
    // Aquí no se hace nada con el mensaje recibido
    rl.prompt();
});

// Manejar notificaciones sin mostrar en terminal, solo como notificación emergente
socket.on('notification', (notification) => {
    notifier.notify({
        title: 'Nuevo mensaje',
        message: notification
    });
    rl.prompt();
});

socket.on('disconnect', () => {
    rl.close(); // Cerrar la interfaz de readline al desconectarse
});

// Manejar la entrada del usuario y enviar mensajes sin mostrar en terminal
rl.on('line', (line) => {
    if (line.trim() === "0") {
        socket.disconnect(); // Finalizar conexión si se escribe "0"
    } else {
        socket.emit('message', line.trim()); // Enviar mensaje al servidor sin mostrar en terminal
    }
    rl.prompt(); // Restablecer el prompt
});



/*const net = require('net');
const readline = require('readline');
const notifier = require('node-notifier');

const opciones = {
    port: 4000,
    host: '127.0.0.1'
};

const client = net.createConnection(opciones);

// Crear una interfaz para la entrada de línea
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'Escribe algo: '
});

client.on('connect', () => {
    console.log('Conexión satisfactoria al servidor');
    rl.prompt(); // Mostrar el prompt inicial
});

// Manejar la recepción de datos desde el servidor
client.on('data', (data) => {
    const message = data.toString().trim();

    if (message.startsWith('NOTIFICACION:')) {
        const notificationMessage = message.slice(13); // Mostrar notificación
        notifier.notify({
            title: 'Nuevo mensaje',
            message: notificationMessage 
        });
    } else {
        console.log(`Mensaje recibido: ${message}`); // Mostrar mensaje normal
    }

    rl.prompt(); // Restablecer el prompt
});

client.on('error', (err) => {
    console.log('Error: ' + err.message);
});

client.on('end', () => {
    console.log('Desconectado del servidor');
    rl.close(); // Cerrar la interfaz de readline cuando se desconecta
});

// Manejar la entrada del usuario y enviar mensajes
rl.on('line', (line) => {
    if (line.trim() === "0") {
        client.end(); // Finalizar conexión si se escribe "0"
    } else {
        client.write(line.trim()); // Enviar mensaje al servidor
    }
    rl.prompt(); // Restablecer el prompt
});*/
