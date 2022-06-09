import express from 'express';
import routerProductosTest from './router/routerProductosTest.js';
import archivosMensajes from './container/archivosMensajes.js';
import archivosProductos from './container/archivosProductos.js';

import { normalize, denormalize, schema } from "normalizr";

import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('clase22/public'));

app.use('/api/productos-test', routerProductosTest)

const server = httpServer.listen(8080, ()=>{
    console.log(`Servidor conectado. Puerto: ${server.address().port}`);
})
server.on('error', error => console.log((`Error en servidor ${error}`)));

let idMsj=1
const productos=[];
let mensajes =[];

async function normalizarMensajes(){
    const arrayMensajes = await fileMsj.listMsj()
    const msjNormalizr = normalize(arrayMensajes, [mensajesEntity])
    return msjNormalizr
}


const fileMsj = new archivosMensajes()
const fileProductos = new archivosProductos()

const authorEntity = new schema.Entity('author', {}, { idAttribute: 'id' });

const mensajeEntity = new schema.Entity('post', { author: authorEntity }, { idAttribute: '_id' })

const mensajesEntity = new schema.Entity('posts', { mensajes: [ mensajeEntity ] }, { idAttribute: 'id' })

const allProductosFile = await fileProductos.listProductos()

io.on('connection', async (socket)=>{
    const allMsj = await normalizarMensajes()

    socket.emit('mensajes', allMsj);

    socket.emit('productos', allProductosFile); 

    socket.on('nuevoProducto', async (data) =>{
        productos.push(data);

        await fileProductos.saveProduct(data)

        io.sockets.emit('productos', productos);
    });

    socket.on('nuevoMsj', async (data) =>{
        data.id=idMsj

        idMsj++

        await fileMsj.saveMsj(data)

        const updateMsj = await normalizarMensajes()

        io.sockets.emit('mensajes', updateMsj);
    });
})