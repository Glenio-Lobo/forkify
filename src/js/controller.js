'use strict';

/* Garante que o Parcel transforme o Asset Icons para a versão que está dentro da pasta
dist.
*/
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import MODAL_CLOSE_SECONDS from './config.js';

import * as model from './model.js';
import icons from '/src/img/icons.svg';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

function init(){
    recipeView.addHandlerRender(controlRecipe);
    recipeView.addHandlerUpdateServings(controlServings);
    recipeView.addHandlerAddBookmark(controlAddBookmark);
    searchView.addHandlerSearch(controlSearchResults);
    paginationView.addHandlerClick(controlPagination);
    bookmarkView.addHandlerRender(controlLoadBookmarks);
    addRecipeView.addHandlerUpload(controlAddRecipe);
}

async function controlRecipe(){
    try{
        // Obtendo a string após a hash 
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

async function controlSearchResults(){
    try{
        resultsView.renderSpinner();

        const query = searchView.getQuery();

        await model.loadSearchResults(query);

        resultsView.render(model.getSearchResultsPage());
        paginationView.render(model.state.search);
    }catch(err){
        console.log(err);
        resultsView.renderError();
    }
}

const controlPagination = function(page){
    resultsView.render(model.getSearchResultsPage(page));
    paginationView.render(model.state.search);
}

const controlServings = function(newServings){
    model.updateServings(newServings);
    recipeView.update(model.state.recipe);
}

const controlAddBookmark = function(){

    /* Se não existir essa bookmark adiciona, se existir deleta. */
    if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
    else model.deleteBookmark(model.state.recipe.id);

    recipeView.update(model.state.recipe);

    //Rendering o bookmark
    bookmarkView.render(model.state.bookmarks);
}

const controlLoadBookmarks = function(){
    model.initStoredBookmarks();
    bookmarkView.render(model.state.bookmarks);
}

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

init();