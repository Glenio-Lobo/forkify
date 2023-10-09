/**
 * @module ResultsView
 * @description View of the search results
 */
import View from './view.js';
import PreviewView from './previewView.js'
// @ts-ignore
import icons from 'url:../../img/icons.svg';

/**
 * ResultsView class
 * @extends PreviewView
 */
class ResultsView extends PreviewView{
    constructor(){
        super();
        this.setParentElement = document.querySelector('.search-result__list');
        this.setErrorMessage = 'No recipes found for your query! Please try again ;)';
        this.setMessage = '';
    }

    // addHandlerSorting(handler){
    //     this.getParentElement.previousElementSibling?.addEventListener('click', e => {
    //         //@ts-ignore
    //         const sortOption = e.target.closest('.sort-list__item');
    //         if(!sortOption) return;
            
    //         if(sortOption.classList.contains('sort-list__item--ingredients')) handler('ingredients')
    //         if(sortOption.classList.contains('sort-list__item--duration')) handler('duration')
    //     });
    // }
}

export default new ResultsView();