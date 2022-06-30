import faker from 'faker'
faker.locale ='es'

function generarProducto(id){
    return{
        id:id,
        nombre: faker.commerce.product(),
        precio: faker.commerce.price(),
        img: faker.image.image()
    }
}

export {generarProducto}