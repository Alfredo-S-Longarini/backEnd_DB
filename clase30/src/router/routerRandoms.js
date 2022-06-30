import { Router } from "express";
const routerRandoms = new Router()

import { fork } from 'child_process';
import path from 'path'

function forkChildProcess(cant){
    const randoms = fork(path.resolve('C:/Users/Usuario/Desktop/backEnd_DB/clase28/src/api/randomsNros.js'))
    randoms.on('nros', resultado => {
        if (resultado === 'listo') {
            randoms.send(cant)
        } else {
            res.json(resultado)
        }
    })
}

routerRandoms.get('/', (req, res)=>{

    if(req.query.cant>0){
        const randoms = fork(path.resolve('C:/Users/Usuario/Desktop/backEnd_DB/clase28/src/api/randomsNros.js'))
        randoms.on('nros', resultado => {
            if (resultado === 'listo') {
                randoms.send(req.query.cant)
            } else {
                res.json(resultado)
            }
        })
    }else{
        const randoms = fork(path.resolve('C:/Users/Usuario/Desktop/backEnd_DB/clase28/src/api/randomsNros.js'))
        randoms.on('nros', resultado => {
            if (resultado === 'listo') {
                randoms.send(100000000)
            } else {
                res.json(resultado)
            }
        })
    }
})

export default routerRandoms