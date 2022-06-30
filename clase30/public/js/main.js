const socket = io();

const registroProductos = document.getElementById('registroProductos');
registroProductos.addEventListener('submit', e => {

    e.preventDefault();
    
    const producto = {
        nombre: registroProductos[0].value,
        precio: registroProductos[1].value,
        stock: registroProductos[2].value,
        img: registroProductos[3].value
    }

    socket.emit('nuevoProducto', producto);

    registroProductos.reset();
})

const registroMsj = document.getElementById('registroMsj');
registroMsj.addEventListener('submit', e=>{
    e.preventDefault();

    const mensaje = {
        author:{
            id: registroMsj[0].value,
            nombre: registroMsj[1].value,
            apellido: registroMsj[2].value,
            edad: registroMsj[3].value,
            alias: registroMsj[4].value,
            avatar: registroMsj[5].value
        },
        text: registroMsj[6].value
    }

    socket.emit('nuevoMsj', mensaje)

    registroMsj[6].value ="";
    autoScroll()
})

const autoScroll =()=>{
    const chat=document.getElementById('msjArea');
    chat.scrollTo(0, chat.scrollHeight)
}

socket.on('productos', data=>{
    eventProductos(data);
});

async function eventProductos(productos){
    const callList = await fetch('plantillas/list.hbs');
    const textoList = await callList.text();
    const compileList = Handlebars.compile(textoList);
    const html = compileList({productos});

    document.getElementById('prodList').innerHTML = html;

}

const authorEntity = new normalizr.schema.Entity('author', {}, { idAttribute: 'id' });

const mensajeEntity = new normalizr.schema.Entity('post', { author: authorEntity }, { idAttribute: '_id' })

const mensajesEntity = new normalizr.schema.Entity('posts', { mensajes: [ mensajeEntity ] }, { idAttribute: 'id' })

socket.on('mensajes', (data)=>{
    const object = normalizr.denormalize(data.result, [mensajesEntity], data.entities);
    console.log(object);
    eventMensajes(object)

    let msjNormalizeSize = JSON.stringify(data).length
    let msjDenormalizeSize = JSON.stringify(object).length

    let porcentajeComp = parseInt((msjNormalizeSize * 100) / msjDenormalizeSize)
    compresionMensajes(porcentajeComp)
});

async function compresionMensajes(porcentaje){
    const callPlantilla = await fetch('plantillas/porcentaje.hbs')
    const textoPlantilla = await callPlantilla.text()
    const compilePlantilla = Handlebars.compile(textoPlantilla)
    const htmlPorcentaje = compilePlantilla({porcentaje})

    document.getElementById('areaPorcentaje').innerHTML = htmlPorcentaje
}

async function eventMensajes(mensajes){
    const callMsj = await fetch('plantillas/mensajes.hbs');
    const textoMsj = await callMsj.text();
    const compileMsj = Handlebars.compile(textoMsj);
    const htmlMsj = compileMsj({mensajes});

    document.getElementById('msjArea').innerHTML = htmlMsj;
};

const formularioLogin = document.getElementById('login');
formularioLogin.addEventListener('submit', e => {
    let userName = ''
    
    userName = formularioLogin[0].value

    socket.emit('newUser', userName)

})

socket.on("saludo", data=>{
    console.log(data.saludo);
})