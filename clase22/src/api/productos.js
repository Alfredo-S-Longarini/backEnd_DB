import fs from 'fs'
import { generarProducto } from "../utils/generadorDeProductos.js"
import { generarId } from "../utils/generadorDeId.js"
import ContenedorArchivo from "../container/containerArchivos.js"


export default class ApiProductosMock extends ContenedorArchivo {
    constructor() { super('clase22/DB/productosFaker.txt') }

    async escribirArchivo(date){
        try{
            return await fs.promises.writeFile(this.nameFile, date);
        }catch(error){
            console.log(error);
        }
    }

    async borrarArchivo(){
        try{
            await fs.promises.writeFile(this.nameFile, []);
        }catch(error){
            console.log(error);
        }
    }

    async leerArchivo(){
        try{
            const data = await fs.promises.readFile(this.nameFile, 'utf-8');
            return data;
        }catch (error){
            console.log(error);
        }
    }

    async popular(cant = 5) {
        await this.escribirArchivo(JSON.stringify([], null, 2))
        let nuevos = []
        for (let i = 0; i < cant; i++) {
            const nuevoUsuario = generarProducto(generarId())
            nuevos.push(nuevoUsuario)
        }
        nuevos = JSON.stringify(nuevos, null, 2);
        await this.escribirArchivo(nuevos)
        return JSON.parse(nuevos)
    }

    async listarAll(){
        const contProducts = await this.leerArchivo()
        const contProductsParse = JSON.parse(contProducts);
        return contProductsParse
    }
}