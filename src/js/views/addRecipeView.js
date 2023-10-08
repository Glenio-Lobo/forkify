/**
 * @module AddRecipeView
 * @description View of the recipe creation function
 */

import View from './view.js';
// @ts-ignore
import icons from 'url:../../img/icons.svg';

/**
 * AddRecipeView Class
 * @extends View
 */
class AddRecipeView extends View{
    /**
     * Window of the form to add information about the new recipe
     * @type {Element}
     */
    // @ts-ignore
    #window = document.querySelector('.add-recipe');
    /**
     * Overlay on page
     * @type {Element}
     */
    // @ts-ignore
    #overlay = document.querySelector('.overlay');
    /**
     * Close button of the form view
     * @type {Element}
     */
    // @ts-ignore
    #closeBtn = document.querySelector('.btn--close');
    /**
     * Add recipe button
     * @type {Element}
     */
    // @ts-ignore
    #openBtn = document.querySelector('.navlist__btn--add--recipe');

    /** Makes a new addRecipeView Object */
    constructor(){
        super();
        this.setParentElement = document.querySelector('.upload');
        this.setMessage = 'Recipe was succesfully uploaded ;)';

        this.#addHandlerShowWindow();
        this.#addHandlerCloseWindow();
    }

    /** Adds a listener to the click event on the open btn that toggles the view visibility */
    #addHandlerShowWindow(){
        this.#openBtn.addEventListener('click', this.toggleWindow.bind(this));
    }

    /** Adds a listener to the click event on the close btn that toggles the view visibility */
    #addHandlerCloseWindow(){
        this.#closeBtn.addEventListener('click', this.toggleWindow.bind(this));
        this.#overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    /**
     * Adds a listerner to the form submit event. 
     * @param {function} handler 
     */
    addHandlerUpload(handler){
        this.getParentElement.addEventListener('submit', function(e){
            e.preventDefault();
            // @ts-ignore
            let data = [...new FormData(this)];
            // @ts-ignore
            data = Object.fromEntries(data);
            console.log(data);
            handler(data);
        })
    }

    /** Toggle the visibility of the add recipe window */
    toggleWindow(){
        this.#window.classList.toggle('hidden');
        this.#overlay.classList.toggle('hidden');
    }
}

export default new AddRecipeView();