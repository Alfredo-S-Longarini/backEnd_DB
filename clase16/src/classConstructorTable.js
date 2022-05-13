import knexLib from 'knex';

class tableBuilder{

    constructor(config){
        this.knex = knexLib(config);
    }

    crearTabla(name){
        
        if(name=='productos'){
            this.knex.schema.hasTable('productos')
                .then(exists=>{
                    if(!exists){
                        this.knex.schema.createTable('productos', table => {
                            table.increments('id').primary();
                            table.string('nombre', 50).notNullable();
                            table.float('precio');
                            table.integer('stock');
                            table.string('img');
                        })
                            .then(()=>{
                                console.log('Tabla Productos Creada!');
                            })
                    }else{
                        console.log('la tabla productos ya existe. No se realizaran cambios');
                    }
                })
                .finally(()=>{
                    this.close;
                });

        }else{
            this.knex.schema.hasTable('mensajes')
                .then(exists=>{
                    if(!exists){
                        this.knex.schema.createTable('mensajes', table => {
                            table.increments('id').primary();
                            table.string('correo', 50).notNullable();
                            table.string('msj');
                            table.date('hs');
                        })
                            .then(()=>{
                                console.log('Tabla Mensajes Creada!');
                            })
                    }else{
                        console.log('la tabla Mensajes ya existe. No se realizaran cambios');
                    }
                })
                .finally(()=>{
                    this.close;
                });
        }
    }

    async insertValue(data, num){
        if(num==1){
            return await this.knex('productos').insert(data);
        }else{
            return await this.knex('mensajes').insert(data);
        }
    }

    async listProductos(){
       return await this.knex('productos').select('*'); 
    }

    listMsj(){
        return this.knex('mensajes').select('*'); 
     }

    deleteItemId(id){
        return this.knex.from('productos').where('id', id).del();
    }

    updateStockId(stock, id){
        return this.knex.from('productos').where('id', id).update({stock:stock});
    }

    close(){
        this.knex.destroy();
    }
    
}

export default tableBuilder;