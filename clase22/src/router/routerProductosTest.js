import { Router } from "express";
import ApiProductosMock from '../api/productos.js'

const apiProductos = new ApiProductosMock()

const routerProductosTest = new Router()

routerProductosTest.get('/', async (req, res)=>{
    try{
        await apiProductos.popular(req.query.cant)
        const rta = await apiProductos.listarAll()
        res.json(rta)
    }catch(err){
        console.log(err);
    }
})

export default routerProductosTest;