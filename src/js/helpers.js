/**
 * @module helpers
 * @description Contains several helpers functions.
 */

import { TIMEOUT_SECONDS } from './config.js';

/**
 * Fetch a get or post request the informed url
 * @function
 * @async
 * @param {string} url API URL that will be fetched
 * @param {Object} [uploadData=undefined] Data to be uploaded on the API 
 * @returns {Promise} Data resulting from the fetch
 */
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

/**
 * Creates a timeout promise
 * @param {number} s Seconds representing the limit of the timeout 
 * @returns {Promise} Returns a promise containing the setTimeout funciton 
 */
const timeout = function(s){
    return new Promise(function(_, reject){
        setTimeout(function() {
            reject(new Error(`Request took too long! Timeout after ${s} seconds.`));
        }, s * 1000);
    });
}