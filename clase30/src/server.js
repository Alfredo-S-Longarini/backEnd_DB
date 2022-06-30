import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import routerProductosTest from './router/routerProductosTest.js';
import routerInfo from './router/routerInfo.js';
import routerRandoms from './router/routerRandoms.js';
import archivosMensajes from './container/archivosMensajes.js';
import archivosProductos from './container/archivosProductos.js';
import 'dotenv/config';

import { normalize, schema } from "normalizr";

import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';
import cluster from 'cluster';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('clase28/public'));

app.use((req,res,next)=>{
    req.io=io;
    next()
})

//Routers
app.use('/api/productos-test', routerProductosTest)
app.use('/api/randoms', routerRandoms)
app.use('/info', routerInfo)

// const server = httpServer.listen(8080, ()=>{
//     console.log(`Servidor conectado. Puerto: ${server.address().port}`);
// })
// server.on('error', error => console.log((`Error en servidor ${error}`)));

let idMsj=1
const productos=[];

let userName='';

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

    socket.on('newUser', data=>{
        userName=data
    })
})

const advanceOptions = {useNewUrlParser: true, useUnifiedTopology: true}

let contador = 0

const mongoString = process.env.MONGO_STRING

app.use(session({

    store: MongoStore.create({
        mongoUrl: `mongodb+srv://AlfredoSL:AlfredMongoSL@cluster0.jsxgmok.mongodb.net/sesiones`,
        mongoOptions:advanceOptions,
        ttl: 10000
    }),

    secret: 'secretWord',
    resave: false,
    saveUninitialized: false
    
}))

app.get('/sin-session', (req, res) => {
    res.send({ contador: contador++ })
})

app.get('/con-session', (req, res)=>{
    if(req.session.contador){
        req.session.contador++
        res.send(`Ha visitado el sitio ${req.session.contador} veces. ${req.session.user}`)
    }else{
        req.session.user = userName
        res.send(`Bienvenido ${req.session.user}!`)
    }
})

app.post('/con-session', (req, res)=>{
    console.log(req.body);
})

app.get('/logout', (req, res) => {
    userName=''
    req.session.destroy(err => {
        if (!err) res.send('Logout ok!')
        else res.send({ status: 'Logout ERROR', body: err })
    })
})

import { cpus } from 'os';
import http from 'http'

const numCpus = cpus().length

if(cluster.isPrimary){
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCpus; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    })
}else{
    http.createServer((req, res)=>{
        res.writeHead(200);
        res.end('Hello World')
    }).listen(8080)

    console.log(`Worker ${process.pid} started`);
}
