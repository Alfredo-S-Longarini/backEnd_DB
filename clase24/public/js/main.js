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

socket.on('mensajes', data=>{
    eventMensajes(data)
});

async function eventMensajes(mensajes){
    const callMsj = await fetch('plantillas/mensajes.hbs');
    const textoMsj = await callMsj.text();
    const compileMsj = Handlebars.compile(textoMsj);
    const htmlMsj = compileMsj({mensajes});

    document.getElementById('msjArea').innerHTML = htmlMsj;
};