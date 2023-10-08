/** 
 * @module previewView
 * @description Generates a markup with reduced information about the recipes.
 */
import View from './view.js';
//@ts-ignore
import icons from 'url:../../img/icons.svg';

/**
 * PreviewView class
 * @extends View
 */
export default class PreviewView extends View{

    /**
     * Creates the markup preview of all available recipes
     * @returns {string} HTML representing the preview markup of all recipes
     */
    _generateMarkup(){
        return this.getData.map(recipe => this._generateMarkupPreview(recipe)).join('');
    }

    /**
     * Creates a preview markup of an recipe
     * @param {Object} recipe Recipe Object
     * @returns {string} HTML representing the preview markup
     */
    _generateMarkupPreview(recipe){
        const id  = window.location.hash.slice(1);

        return `<li class="preview">
                    <a class="preview__link ${ id === recipe.id ? 'preview__link--active' : ''}" href="#${recipe.id}">
                        <figure class="preview__figure">
                            <img src=${recipe.imageUrl} alt="Product Image">
                        </figure>

                        <div class="preview__content">
                            <h4>${recipe.title}</h4>
                            <p>${recipe.publisher}</p>

                            <div class="preview__user ${recipe.key ?  '' : 'hidden'}">
                                <svg>
                                    <use href="${icons}#icon-user"></use>
                                </svg>
                            </div>
                        </div>
                    </a>
                </li>`;
    }
}
