/**
 * @module model
 * @description Controls the access to the API data
 */

// @ts-ignore
import { API_URL, RESULTS_PER_PAGE, API_KEY, API_URL_CALORIES, API_CALORIES_KEY } from './config.js';
import { AJAX, sendJsonCaloriesAPI } from './helpers.js';

// Estado da aplicação

/**
 * @typedef ingredients Ingredient data
 * 
 * @property {string} description
 * @property {number} quantity
 * @property {string} unit 
 */

/**
 * @typedef recipe Complete recipe data
 * 
 * @property {number} cookingTime
 * @property {number} id
 * @property {ingredients[]} ingredients 
 * @property {string} imageUrl
 * @property {string} publisher
 * @property {number} servings
 * @property {string} sourceUrl
 * @property {string} title
 * @property {boolean} [bookmarked]
 * @property {number} [totalCalories]
 */

/**
 * @typedef reducedRecipe Reduced recipe information for search exibition 
 * @property {number} id
 * @property {string} imageUrl
 * @property {string} publisher
 * @property {string} title
 * @property {number} [key]
 */

/**
 * @typedef search
 * @property {string} query Search Query
 * @property {reducedRecipe[]} results Array of the query result data
 * @property {number} page Current page of exibition
 * @property {number} resultsPerPage Number of results per page
 */

/**
 * @typedef state
 * @property {recipe} recipe Current recipe
 * @property {Object} calories Contains the calories of the loaded recipe
 * @property {search} search Contains information about the users search
 * @property {recipe[]} bookmarks Contains the bookmarked recipe
 */

/** @constant {state} state Current aplication state */
export const state = {
    recipe: {},
    calories: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RESULTS_PER_PAGE,
    },
    bookmarks: []
};

/**
 * Build a recipe Object
 * @param {Object} data Data returned from the API
 * @returns {recipe} Returns the recipe
 */
const createObjectRecipe = function(data){
    const {recipe} = data.data;

    /*
     * ...(recipe.key && {key: recipe.key})
     * && dá short circuit se o recipe.key não existir, assim retorna null e a desestruturação não tem nenhum efeito.
     * Caso exista, desestrutura o objeto key e adiciona a propriedade.
     * 
     * 
     */

    return {
        id: recipe.id,
        title: recipe.title,
        ingredients: recipe.ingredients,
        imageUrl: recipe.image_url,
        publisher: recipe.publisher,
        servings: recipe.servings,
        sourceUrl: recipe.source_url,
        cookingTime: recipe.cooking_time,
        ...(recipe.key && {key: recipe.key}),
    };
}

/**
 * Renders the recipe and change the app state
 * @async
 * @function
 * @param {string} recipeId
 * @returns {Promise}
 */
export const loadRecipe = async function(recipeId){
    try{
        // Chamando API
        const data = await AJAX(`${API_URL}${recipeId}?key=${API_KEY}`);
        
        state.recipe = createObjectRecipe(data);
        
        console.log(data);

        /** @param {reducedRecipe} bookRecipe */
        const verifyBookId = bookRecipe => state.recipe.id === bookRecipe.id;

        // Verifica se a receita está na lista dos favoritos, se sim, marca ela como favorita.
        if(state.bookmarks.some(verifyBookId)){
            state.recipe.bookmarked = true;
        }

        console.log(data, state);

    }catch(err){
        throw err;
    }
};

/**
 * Gets the total amount of calories
 * @function 
 * @async
 */
export const loadCaloriesOfRecipe = async function(){
    try{ 
        const urlStringOfIngredients = state.recipe.ingredients.map(ing => {
            const ingUrlString = [];

            if(!ing.quantity) ingUrlString.push(1) 
            else ingUrlString.push(ing.quantity);

            if(ing.unit !== '') ingUrlString.push(ing.unit);

            ingUrlString.push(ing.description.replace(/ /g, '-'));
            
            return ingUrlString.join('-');
        }).join('\\n');

        
        // const urlCaloriesApi = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=75d1465069c2439386e5dbe1a67816f4`;
        const calories = await sendJsonCaloriesAPI(`${API_URL_CALORIES}parseIngredients?apiKey=${API_CALORIES_KEY}`, urlStringOfIngredients);

        state.recipe.totalCalories = calories.reduce(function(acc, ing){
            if(!ing.id) return acc;
            const i = ing.nutrition.nutrients.findIndex(val => val.name === 'Calories');
            return acc + ing.nutrition.nutrients[i].amount; //kcal
        }, 0);

        // state.recipe.calories.forEach(ing => {
        //     const i = ing.nutrition.nutrients.findIndex(val => val.name === 'Calories');
        //     console.log(ing.amount, ': ', ing.nutrition.nutrients[i].amount);
        // });
        // console.log('Current indredients: ', state.recipe.calories, state.recipe.totalCalories);
    }catch(err){
        state.recipe.totalCalories = null;
        // throw err;
    }
}

/**
 * Loads the recipes of the search result on the state
 * 
 * @function
 * @async
 * @param {string} search 
 * @returns {Promise}
 */
export const loadSearchResults = async function(search){
    try{
        const alteredSearch = search.trim().toLowerCase().replace(/ /g, '-');
        const recipesResults = await AJAX(`${API_URL}?search=${alteredSearch}&key=${API_KEY}`);

        state.search.query = alteredSearch;
        console.log('Recipe being loaded: ', recipesResults);
        state.search.results = recipesResults.data.recipes.map( recipe => {

            return {
                id: recipe.id,
                title: recipe.title,
                imageUrl: recipe.image_url,
                publisher: recipe.publisher,
                ...(recipe.key && {key: recipe.key}),
            }
        });
        state.search.page = 1;
    }catch(err){
        throw err;
    }
}

/**
 * Gets the recipes that will be exibited in a x page.
 * The number of recipes per page are defined on the state.
 * 
 * @function
 * @async
 * @param {number} [page=state.search.page]
 * @returns {reducedRecipe[]} Returns the recipes on the specified page
 */
export const getSearchResultsPage = function(page = state.search.page) {
    const start = (page-1)*state.search.resultsPerPage;
    const end = page*state.search.resultsPerPage;

    state.search.page = page;
    
    return state.search.results.slice(start, end);
}

/**
 * Updates the servings
 * @function
 * @async
 * @param {number} newServings 
 */
export const updateServings = function(newServings){
    console.log('--------->', state.recipe);
    state.recipe.ingredients.forEach(ing => {
        ing.quantity *= newServings/state.recipe.servings;
    });
    state.recipe.totalCalories *=  newServings/state.recipe.servings;
    state.recipe.servings = newServings;
}

/** Saves the current bookmarks on the local storage */
const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

/** Clear the local storage */
// @ts-ignore
const clearBookmarks = function(){
    // localStorage.clear('bookmarks');
    localStorage.clear();
}

/**
 * Get the bookmarks stored on local storage
 * @function
 */
export const initStoredBookmarks = function(){
    const stored = localStorage.getItem('bookmarks');
    if(stored) {
        state.bookmarks = JSON.parse(stored);
    }
}

/**
 * Adds the recipe on the bookmark list and bookmark the recipe
 * @function
 * @async
 * @param {recipe} recipe 
 */
export const addBookmark = function(recipe){
    
    if(!recipe || Object.keys(recipe).length === 0) return;

    //Se a recipe não estiver favoritada, então favorita ela.
    // @ts-ignore
    state.bookmarks.push(recipe);

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

/**
 * Deletes a recipe from the bookmark list
 * @function
 * @async
 * @param {number} id Recipe id 
 */
export const deleteBookmark = function(id){
    // @ts-ignore
    const indexForDelete = state.bookmarks.findIndex(bookRecipe => id === bookRecipe.id);
    state.bookmarks.splice(indexForDelete, 1);

    if(id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

/**
 * Uploads a recipe on the API server
 * @function
 * @async
 * @param {Object} newRecipe Object with the new recipe information
 */
export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
        .map(ing => {
            const ingValues = ing[1].split(',').map( el => el.trim()); 
            if(ingValues.length !== 3) throw new Error('Wrong ingredient format.');

            const [quantity, unit, description] = ingValues;
            return {quantity: quantity ? Number(quantity) : null, unit, description};
        });;

        console.log('new recipe: ', newRecipe);
        const recipe = {
            title: newRecipe.title,
            ingredients: ingredients,
            image_url: newRecipe.imageUrl,
            publisher: newRecipe.publisher,
            servings: newRecipe.servings,
            source_url: newRecipe.sourceUrl,
            cooking_time: newRecipe.cookingTime,
        }

        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
        state.recipe = createObjectRecipe(data);
        // @ts-ignore
        addBookmark(state.recipe);
    }catch(err){
        throw err;
    }
}

// export const sortResults = async function(sortingParam){
//     if(!sortingParam || state.search.results.length === 0) return;

//     const resultPromises = state.search.results.map(async function(val){
//         const data = await AJAX(`${API_URL}${val.id}?key=${API_KEY}`);
//         return data.recipe;
//     });

//     let completeResultRecipes; 
//     Promise.all(resultPromises).then(values => console.log(values));

//     console.log(completeResultRecipes);

//     if(sortingParam === 'duration') console.log(state.search.results);
//         // state.search.results.sort((prev, next) => {
//         //     return prev-next;
//         // })
//         // state.search.results.sort();
// }