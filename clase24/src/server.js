import express from 'express';
import routerProductosTest from './router/routerProductosTest.js';
import archivosMensajes from './container/archivosMensajes.js';
import archivosProductos from './container/archivosProductos.js';

import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('clase24/public'));

app.use('/api/productos-test', routerProductosTest)

const server = httpServer.listen(8080, ()=>{
    console.log(`Servidor conectado. Puerto: ${server.address().port}`);
})
server.on('error', error => console.log((`Error en servidor ${error}`)));

let idMsj=1
const productos=[];
const mensajes =[];

const fileMsj = new archivosMensajes()
const fileProductos = new archivosProductos()

const allMsjFile= await fileMsj.listMsj()
const allProductosFile = await fileProductos.listProductos()

io.on('connection', (socket)=>{
    console.log(allMsjFile);
    socket.emit('productos', allProductosFile);
    socket.emit('mensajes', allMsjFile);

    socket.on('nuevoProducto', async (data) =>{
        productos.push(data);

        await fileProductos.saveProduct(data)

        io.sockets.emit('productos', productos);
    });

    socket.on('nuevoMsj', async (data) =>{
        data.id=idMsj

        idMsj++

        mensajes.push(data);

        await fileMsj.saveMsj(data)

        io.sockets.emit('mensajes', mensajes);
    });
})
