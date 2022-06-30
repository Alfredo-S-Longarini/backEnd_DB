import { Router } from "express";

const routerInfo = new Router()

const info={
    inputArguments: process.argv,
    namePlatform: process.platform,
    nodeVersion: process.version,
    totalMemoryReserved: process.memoryUsage(),
    processId: process.pid,
    executionPath: process.execPath,
    fileProyect: process.cwd()
}

routerInfo.get('/', async (req, res)=>{
    try{
        res.json(info)
    }catch(err){
        console.log(err);
    }
})


export default routerInfo;