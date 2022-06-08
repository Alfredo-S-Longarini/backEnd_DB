import { Router } from "express";
import ApiProductosMock from '../api/productos.js'

const apiProductos = new ApiProductosMock()

const routerProductosTest = new Router()

let listExist=true

let productosFaker = [];

routerProductosTest.get('/', async (req, res)=>{
    try{
        const rta = await apiProductos.listarAll()
        res.json(rta)
    }catch(err){
        console.log(err);
    }
})

routerProductosTest.post('/', async (req, res)=>{
    try{
        await apiProductos.popular(req.query.cant)
        res.json("Productos Generados!")
    }catch(err){
        console.log(err);
    }
})

export default routerProductosTest;