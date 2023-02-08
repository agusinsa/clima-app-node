import axios from 'axios';
import fs from 'fs';


class Busquedas { 
    historial = [];

    dbPath = './db/database.json';

    constructor() { 
        //TODO: leer db si existe
        this.leerDB();
    }

    get historialCapitalizado() { 
        
        return this.historial.map(lugar => { 
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            
            return palabras.join(' ');
        });
    }

    get paramMapbox() { 
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit':5,
            'language':'es'
        }
    }

    get paramWeather() { 
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang:'es'
        }
    }


    async buscarCiudad(lugar = '') { 

        try {
            //peticion http

            const instancia = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramMapbox
            });

            const resp = await instancia.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]

            }));

        } catch (error) {
            
        }
        
        return [];/// retornar los lugares que coincidad con el lugar de la busqueda
    }

    async climaLugar(lat, lon) {

        try {

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: {...this.paramWeather, lat, lon}
                
            });

            const resp = await instance.get();
            const {weather, main } = resp.data;
            
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp:main.temp
            }
        } catch (error) {
            console.log(error);
        }

    }
    
    agregarHistorial(lugar = '') { 
        //todo: prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) { 
            return;
        }

        this.historial=this.historial.splice(0, 4);


        this.historial.unshift(lugar.toLocaleLowerCase());

        //grabar en txt-DB

        this.guardarDB();
    }

    guardarDB() { 
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB() { 
            if (!fs.existsSync(this.dbPath)) return;

            const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8', flag: 'r' })
            
            const data = JSON.parse(info);
        
            this.historial = data.historial;
        
        }
            
            

}

export default Busquedas;   