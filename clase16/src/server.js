import express from 'express';
import {optionsMDB} from '../options/mariaDB.js';
import { optionsSQL } from '../options/SQLite3.js';
import tableBuilder from './classConstructorTable.js';

import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('clase16/public'));

const server = httpServer.listen(8080, ()=>{
    console.log(`Servidor conectado. Puerto: ${server.address().port}`);
})
server.on('error', error => console.log((`Error en servidor ${error}`)));




const productos=[];
const mensajes =[];


const mDB = new tableBuilder(optionsMDB);
const sql = new tableBuilder(optionsSQL);


function crearTablas(){
    mDB.crearTabla('productos')
    sql.crearTabla('mensajes')
}
crearTablas();


const productosDB = await mDB.listProductos();
const msjDB = await sql.listMsj();


io.on('connection', (socket)=>{

    socket.emit('productos', productosDB);
    socket.emit('mensajes', msjDB);

    socket.on('nuevoProducto', async (data) =>{
        productos.push(data);

        console.log(await mDB.insertValue(data, 1));

        io.sockets.emit('productos', productos);
    });

    socket.on('nuevoMsj', async (data) =>{
        data.hs = new Date().toLocaleString();

        mensajes.push(data);

        console.log(await sql.insertValue(data, 2));

        io.sockets.emit('mensajes', mensajes);
    });
})
