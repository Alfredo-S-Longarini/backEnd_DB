import minimist from "minimist";

let min = 1;
let max = 1000;
let num=0;

const arrayNums = []
const arrayNew = []
let arrayCant = []

function numRandoms(){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function generateNros(cant){

    for (let i = 0; i < cant; i++) {
       arrayNums.push(numRandoms())
    }

    for (let i = 0; i < arrayNums.length; i++) {
        num = arrayNums[i]
    
        arrayCant = arrayNums.filter(e=>e==num);
    
        arrayNew.push(`-${num}`)
        arrayNew.push(`${arrayCant.length}`)
        
    }
    
    console.log(arrayNew);
    const arrayParse = minimist(arrayNew);

    return arrayParse
}


process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('nros', cant =>{
    console.log(cant);
    console.log(`worker #${process.pid} iniciando su tarea`)
    const array = generateNros(cant)
    process.send(array)
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})

process.send('listo')