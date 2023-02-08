import * as dotenv from 'dotenv'

dotenv.config()

import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js"
import Busquedas from "./models/busquedas.js";


const main = async() => {

    const busquedas = new Busquedas();
    let opt;    

    busquedas.buscarCiudad

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //mostrar msj
                const lugar = await leerInput('Ciudad: ');

                 //buscar lugares
                const lugares = await busquedas.buscarCiudad(lugar);
           

                //seleccionar lugar
                const id = await listarLugares(lugares);
                if (id === '0') continue;

                //guardar en DB
                const lugarSel = lugares.find(l => l.id === id);
                
                busquedas.agregarHistorial(lugarSel.nombre);

                const { nombre, lng, lat } = lugarSel;

                //datos del clima

                const clima = await busquedas.climaLugar(lat, lng)
                
                const { desc, min, max, temp} = clima;

                //mostrar resultados
                console.clear();
                console.log('\nInformacion de la ciudad\n'.green);
                console.log('Ciudad: ',nombre);
                console.log('Lat: ',lat);
                console.log('Long', lng);
                console.log('Temperatura: ',temp);
                console.log('Minima: ', min);
                console.log('Maxima: ', max);
                console.log('Clima: ', desc);

                break;
            
                case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}`.green;
                    console.log(`${idx}. ${lugar}`)
                    })
                break;  
        }

        


        if(opt!==0)await pausa();

    } while (opt!==0);

    
}

main();