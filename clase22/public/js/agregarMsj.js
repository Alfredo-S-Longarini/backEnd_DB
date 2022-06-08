import { denormalize } from 'normalizr';
import util from 'util';

export async function agregarMsjHtml(dataNormalizr, dataEntity){
    console.log(dataNormalizr.result);
    console.log(dataNormalizr.entities);
    console.log(dataEntity);
    const mensajeDenormalizado = denormalize(dataNormalizr.result, [dataEntity], dataNormalizr.entities)
    const msjPrint = util.inspect(mensajeDenormalizado, false, 12, true)
    console.log(mensajeDenormalizado);

    // const mensajes = mensajeDenormalizado

    // const callMsj = await fetch('http://localhost:8080/public/plantillas/mensajes.hbs');
    // const textoMsj = await callMsj.text();
    // const compileMsj = Handlebars.compile(textoMsj);
    // const htmlMsj = compileMsj({mensajeDenormalizado});

    // document.getElementById('msjArea').innerHTML = htmlMsj;
}