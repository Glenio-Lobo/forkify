import { API_URL, RESULTS_PER_PAGE, API_KEY, CALORIES_API_KEY } from './config.js';
import { AJAX, sendJsonCaloriesAPI } from './helpers.js';

// Estado da aplicação
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

//Responsável por carregar a receita e mudar o estado do programa
export const loadRecipe = async function(recipeId){
    try{
        // Chamando API
        const data = await AJAX(`${API_URL}${recipeId}?key=${API_KEY}`);
        
        state.recipe = createObjectRecipe(data);

        if(state.bookmarks.some(bookRecipe => state.recipe.id === bookRecipe.id)){
            state.recipe.bookmarked = true;
        }

    }catch(err){
        throw err;
    }
};

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

        const urlCaloriesApi = `https://api.spoonacular.com/recipes/parseIngredients?apiKey=75d1465069c2439386e5dbe1a67816f4`;
        state.recipe.calories = await sendJsonCaloriesAPI(urlCaloriesApi, urlStringOfIngredients);

        state.recipe.totalCalories = state.recipe.calories.reduce(function(acc, ing){
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
        throw err;
    }
}

export const loadSearchResults = async function(search){
    try{
        const alteredSearch = search.trim().toLowerCase().replace(/ /g, '-');
        const recipesResults = await AJAX(`${API_URL}?search=${alteredSearch}&key=${API_KEY}`);

        state.search.query = alteredSearch;
        state.search.results = recipesResults.data.recipes.map( recipe => {
            // console.log('Recipe being loaded: ', recipe);

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

export const getSearchResultsPage = function(page = state.search.page) {
    const start = (page-1)*state.search.resultsPerPage;
    const end = page*state.search.resultsPerPage;

    state.search.page = page;

    return state.search.results.slice(start, end);
}

export const updateServings = function(newServings){
    console.log('--------->', state.recipe);
    state.recipe.ingredients.forEach(ing => {
        ing.quantity *= newServings/state.recipe.servings;
    });
    state.recipe.totalCalories *=  newServings/state.recipe.servings;
    state.recipe.servings = newServings;
}

const persistBookmarks = function(){
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

const clearBookmarks = function(){
    localStorage.clear('bookmarks');
}

export const initStoredBookmarks = function(){
    const stored = localStorage.getItem('bookmarks');
    if(stored) {
        state.bookmarks = JSON.parse(stored);
    }
}

export const addBookmark = function(recipe){
    
    //Se a recipe não estiver favoritada, então favorita ela.
    state.bookmarks.push(recipe);

    if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
}

export const deleteBookmark = function(id){
    const indexForDelete = state.bookmarks.findIndex(bookRecipe => id === bookRecipe.id);
    state.bookmarks.splice(indexForDelete, 1);

    if(id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
}

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
        addBookmark(state.recipe);
        console.log(state.recipe);
    }catch(err){
        console.log(err.message);
        throw err;
    }
}