import ContenedorArchivos from "./containerArchivos.js";

export default class archivosMensajes extends ContenedorArchivos{

    constructor(){
        super('clase24/DB/mensajes.txt')
    }

    async saveMsj(msj){
        const arrayMsj = await this.listMsj()
        arrayMsj.push(msj)
        const arrayMsjString = JSON.stringify(arrayMsj, null, 2)
        await this.escribirArchivo(arrayMsjString)
    }

    async listMsj(){
        const allMsj = await this.leerArchivo()
        const allMsjParse = JSON.parse(allMsj)
        return allMsjParse
    }

}