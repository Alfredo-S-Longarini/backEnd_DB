import { Router } from "express";
import ApiProductosMock from '../api/productos.js'

const apiProductos = new ApiProductosMock()

const routerProductosTest = new Router()

routerProductosTest.get('/', async (req, res)=>{
    try{
        req.io.emit("saludo",{saludo: "hola"})
        await apiProductos.popular(req.query.cant)
        const rta = await apiProductos.listarAll()
        res.send(rta)
    }catch(err){
        console.log(err);
    }
})

export default routerProductosTest;