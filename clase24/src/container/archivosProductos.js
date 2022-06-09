import ContenedorArchivos from "./containerArchivos.js";

export default class archivosProductos extends ContenedorArchivos{

    constructor(){
        super('clase22/DB/productos.txt')
    }

    async saveProduct(product){
        const arrayProduct = await this.listProductos()
        arrayProduct.push(product)
        const arrayProductString = JSON.stringify(arrayProduct, null, 2)
        await this.escribirArchivo(arrayProductString)
    }

    async listProductos(){
        const allProducts = await this.leerArchivo()
        const allProductsParse = JSON.parse(allProducts)
        return allProductsParse
    }

}