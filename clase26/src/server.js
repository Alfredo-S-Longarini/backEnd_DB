import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import routerProductosTest from './router/routerProductosTest.js';
import archivosMensajes from './container/archivosMensajes.js';
import archivosProductos from './container/archivosProductos.js';

import passport from 'passport';
import { Strategy } from 'passport-local';

import { normalize, schema } from "normalizr";

import {Server as HttpServer} from 'http';
import {Server as IOServer} from 'socket.io';

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static('clase24/public'));

app.use((req,res,next)=>{
    req.io=io;
    next()
})

app.use('/api/productos-test', routerProductosTest)

const server = httpServer.listen(8080, ()=>{
    console.log(`Servidor conectado. Puerto: ${server.address().port}`);
})
server.on('error', error => console.log((`Error en servidor ${error}`)));

let idMsj=1
const productos=[];
let mensajes =[];

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

app.use(session({

    store: MongoStore.create({
        mongoUrl:`mongodb+srv://AlfredoSL:AlfredMongoSL@cluster0.jsxgmok.mongodb.net/sesiones`,
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



passport.use('signup', new Strategy({
    passReqToCallback: true},
    (req, username, password, done) => {
      User.findOne({ 'username': username }, function (err, user) {
  
        if (err) {
          console.log('Error in SignUp: ' + err);
          return done(err);
        }
  
        if (user) {
          console.log('User already exists');
          return done(null, false)
        }
  
        const newUser = {
          username: username,
          password: createHash(password),
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
        }
  
        User.create(newUser, (err, userWithId) => {
          if (err) {
            console.log('Error in Saving user: ' + err);
            return done(err);
          }
          console.log(user)
          console.log('User Registration succesful');
          return done(null, userWithId);
        });
      });
    })
  )
