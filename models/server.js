const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //Implementación Socket.io
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.path = {
            authPath: '/api/auth',
            usersPath: '/api/users',
            categoriesPath: '/api/categories',
            productsPath: '/api/products',
            searchPath: '/api/search',
            uploadPath: '/api/upload'
        }

        // Conectar a DB
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Rutas de Restserver
        this.routes();

        // Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // Cors
        this.app.use(cors());
        // Paseo y lectura de body
        this.app.use(express.json());
        // Directorio Publico
        this.app.use(express.static('public'));

        // Express Fileupload - Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.path.authPath, require('../routes/auth'));
        this.app.use(this.path.usersPath, require('../routes/user'));
        this.app.use(this.path.categoriesPath, require('../routes/category'));
        this.app.use(this.path.productsPath, require('../routes/product'));
        this.app.use(this.path.searchPath, require('../routes/search'));
        this.app.use(this.path.uploadPath, require('../routes/upload'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

module.exports = Server;