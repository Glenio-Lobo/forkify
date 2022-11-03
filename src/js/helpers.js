import { TIMEOUT_SECONDS } from './config.js';

export const AJAX = async function (url, uploadData = undefined) {
    try {
      const fetchPro = uploadData
        ? fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
          })
        : fetch(url);
  
      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
      const data = await res.json();
  
      if (!res.ok) throw new Error(`${data.message} (${res.status})`);

      return data;
    } catch (err) {
      throw err;
    }
};

// export const getJson = async function(url){
//     try{
//         //Chamando a API, constrole de 10s de tentativa.
//         const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
//         //Safe Guard da Api, retorna uma menssagem de erro.
//         if(!response.ok) throw new Error('We could not find that recipe. Please try another one!');

//         // Transformando os dados da api
//         const data = await response.json();

//         return data;
//     }catch(err){
//         throw err;
//     }
// };

export const sendJsonCaloriesAPI = async function(url, body){
    try{
        const fetchPro = fetch(url, {
            method: 'POST',
            body: `ingredientList=${body}&includeNutrition=true`,
        });

        //Chamando a API, constrole de 10s de tentativa.
        const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
        // Transformando os dados da api
        const data = await response.json();

        //Safe Guard da Api, retorna uma menssagem de erro.
        if(!response.ok) throw new Error(`${data.message} (${response.status})`);

        return data;
    }catch(err){
        throw err;
    }
}

const timeout = function(s){
    return new Promise(function(_, reject){
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} seconds.`));
        }, s * 1000);
    });
}