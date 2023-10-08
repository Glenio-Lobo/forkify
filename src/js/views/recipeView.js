/** 
 * @module recipeView
 * @description View of the recipe 
 */

// @ts-ignore
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './view.js';

/**
 * Recipe View Class
 * @extends View
 */
class RecipeView extends View{
    // #parentElement = document.querySelector('.recipe');
    // #errorMessage = 'We could not find that recipe. Please try another one!';
    // #message = '';
    
    /** Build a RecibeView */
    constructor(){
        super();
        this.setParentElement = document.querySelector('.recipe');
        this.setErrorMessage = 'We could not find that recipe. Please try another one!';
        this.setMessage = '';
    }

    /**
     * Add two event listeners for the renderization of the recipe on the view.
     * The events added are the hashchange and load, both listened by the window.
     * @param {function} handle 
     */
    addHandlerRender(handle){
        // @ts-ignore
        ['hashchange', 'load'].forEach( event => window.addEventListener(event, handle));
    }

    /**
     * Adds click event to update the recipe servings
     * @param {function} handle 
     */
    addHandlerUpdateServings(handle){
        this.getParentElement.addEventListener('click', function(e){ 
            // @ts-ignore
            const btn = e.target.closest('.recipe__btn');
            if(!btn) return;
            const updateValue = Number(btn.dataset.updateto);
            if(updateValue > 0) handle(updateValue);
        })
    }

    /**
     * Adds a click event to add or remove a recipe from the bookmark list
     * @param {function} handle 
     */
    addHandlerAddBookmark(handle){
        this.getParentElement.addEventListener('click', function(e) {
            // @ts-ignore
            const btn = e.target.closest('.recipe__bookmark');
            if(!btn) return;
            handle();
        })
    }

    /** 
     * Generates the recipe markup
     * @private
     * @returns {string} The markup that represents the recipe Html
     */
    _generateMarkup(){
        return `<figure class="recipe__logo">
                        <img src=${this.getData.imageUrl} alt="Imagem da receita" class="recipe__img">
                        <h1 class="recipe__title">
                            <span>${this.getData.title}</span>
                        </h1>
                    </figure>
    
                    <div class="recipe__details">
                        <div class="recipe__info recipe__info--minutes">
                            <svg class="recipe__icon">
                                <use href="${icons}#icon-clock"></use>
                            </svg>
                            <p class="recipe__info__description">
                                <span>${this.getData.cookingTime}</span> minutes
                            </p>
                        </div>
    
                        <div class="recipe__info recipe__info--servings">
                            <svg class="recipe__icon">
                                <use href="${icons}#icon-users"></use>
                            </svg>
                            <p class="recipe__info__description">
                                <span>${this.getData.servings}</span> servings
                            </p>
                        </div>
    
                        <div class="recipe__buttons">
                            <button class="recipe__btn recipe__btn--decrease" data-updateto=${this.getData.servings-1}>
                                <svg class="recipe__btn__icon">
                                    <use href="${icons}#icon-minus-circle"></use>
                                </svg>
                            </button>
    
                            <button class="recipe__btn recipe__btn--increase" data-updateto=${this.getData.servings+1}>
                                <svg class="recipe__btn__icon">
                                    <use href="${icons}#icon-plus-circle"></use>
                                </svg>
                            </button>
                        </div>

                        <div class="recipe__user ${this.getData.key ?  '' : 'hidden'}">
                            <svg class="recipe__user__icon">
                                <use href="${icons}#icon-user"></use>
                            </svg>
                        </div>

                        <button class="recipe__bookmark">
                            <svg class="recipe__bookmark__icon">
                                <use href="${icons}#icon-bookmark${this.getData.bookmarked ? '-fill' : ''}"></use>
                            </svg>
                        </button>
                    </div>
    
                    <div class="recipe__ingredients ingredients">
                        <h3 class="ingredients__title">recipe ingredients</h3>
    
                        <ul class="ingredients__list">
                            ${this.getData.ingredients.map( ing => this._generateIngredientMarkup(ing)).join('')}
                        </ul>
                        
                        ${this.getData.totalCalories ? 
                            `<h3 class="ingredients__calories"> 
                                <p>Total Calories:</p> 
                                <span>${this.getData.totalCalories.toFixed(2)} KCAL</span> 
                                </h3>`
                            : ''}
                    </div>
    
                    <div class="recipe__directions directions">
                        <h3 class="directions__title">how to cook it</h3>
                        <p class="directions__description">
                            This recipe was carefully designed and tested by 
                            <span class="directions__tester">${this.getData.publisher}</span>. Please check out directions at their website.
                        </p>
    
                        <a href=${this.getData.sourceUrl} class="btn--smaller directions__btn" target="_blank">
                            <span>directions</span>
                            <svg class="directions__btn__icon">
                                <use href="${icons}#icon-arrow-right"></use>
                            </svg>
                        </a>
                    </div>`
    }

    /**
     * Returns the ingredient markup
     * @private
     * @param {Object} ing Ingredient Object 
     * @returns {string} The markup that represents the ingredient html
     */
    _generateIngredientMarkup(ing){
        return `
            <li class="ingredients__item">
                <svg class="ingredients__icon">
                    <use href="${icons}#icon-check"></use>
                </svg>
                <p class="ingredients__description">
                    <span class="ingredients__quant">
                    ${ ing.quantity ? new Fraction(ing.quantity).toString() : '' }
                    </span> 
                    <span class='ingredients__units'>${ing.unit}</span>
                    ${ing.description}
                </p>
            </li>`
    }
}

export default new RecipeView();