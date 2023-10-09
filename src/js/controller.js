'use strict';

/**
 * @module controller
 * @description Middle point between the user(view) and the data(model). Init function sets all necessary handlers.
 */

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SECONDS } from './config.js';

import * as model from './model.js';

/* Garante que o Parcel transforme o Asset Icons para a versão que está dentro da pasta
dist.
*/
// @ts-ignore
import icons from '/src/img/icons.svg';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

/** Adds all necessary handlers to the views */
function init(){
    recipeView.addHandlerRender(controlRecipe);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    // resultsView.addHandlerSorting(controlSorting);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    bookmarkView.addHandlerRender(controlLoadBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}

/**
 * @description Controls the renderization of the recipe
 * @async
 */
async function controlRecipe(){
    try{
        // Obtendo a string após a hash
        console.log(location, location.hash);
        const idUrl = location.hash.slice(1);

        // Se não existir, retorna nada 
        if(!idUrl) return;

        //Updating results view para marcar a recipe selecionada
        resultsView.update(model.getSearchResultsPage());
        bookmarkView.update(model.state.bookmarks);

        // Rendering o loading spinner
        recipeView.renderSpinner();

        //Loading a receita (Async funcitons retornam promisses)
        await model.loadRecipe(idUrl);
        await model.loadCaloriesOfRecipe();

        recipeView.render(model.state.recipe);
    }catch(err){
        console.log(err);
        recipeView.renderError();
    }
}

/**
 * @description Control the user search results
 * @async
 */
async function controlSearchResults(){
    try{
        resultsView.renderSpinner();

        const query = searchView.getQuery();

        // Loads the search resulsts on app state
        await model.loadSearchResults(query);

        // Renders the search results referent to the current page
        resultsView.render(model.getSearchResultsPage());

        // Renders the pagination
        paginationView.render(model.state.search);
    }catch(err){
        console.log(err);
        resultsView.renderError();
    }
}

/**
 * Control the pagination of the search results
 * @param {number} page - Current page
 */
const controlPagination = function(page){
    resultsView.render(model.getSearchResultsPage(page));
    paginationView.render(model.state.search);
}

/**
 * Controls the servings quantity updates
 * @param {number} newServings 
 */
const controlServings = function(newServings){
    model.updateServings(newServings);
    recipeView.update(model.state.recipe);
}

/**
 * Controls the bookmark function
 */
const controlAddBookmark = function(){

    /* Se não existir essa bookmark adiciona, se existir deleta. */
    // @ts-ignore
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    recipeView.update(model.state.recipe);

    //Rendering o bookmark
    bookmarkView.render(model.state.bookmarks);
}

/** Control the loading of bookmarks. They are loaded on window load. */
const controlLoadBookmarks = function(){
    model.initStoredBookmarks();
    bookmarkView.render(model.state.bookmarks);
}

/**
 * Control the addition of a new recipe to the api
 * @param {Object} newRecipe The informartion about the new recipe 
 */
const controlAddRecipe = async function(newRecipe){
    try{
        addRecipeView.renderSpinner();

        await model.uploadRecipe(newRecipe);

        //Rendering the recipe

        await model.loadCaloriesOfRecipe();
        recipeView.render(model.state.recipe);

        addRecipeView.renderMessage();

        bookmarkView.render(model.state.bookmarks);

        //Changing id in the url
        window.history.pushState(null, '', `#${model.state.recipe.id}`);

        //close window
        // setTimeout(function(){addRecipeView.toggleWindow()}, MODAL_CLOSE_SECONDS*1000);
    }catch(err){
        console.log(err);
        addRecipeView.renderError(err.message);
    }
}

// const controlSorting = function(sortingParam){
//     resultsView.renderSpinner();
//     model.sortResults(sortingParam);
// }

init();