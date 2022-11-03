import View from './view.js';
import PreviewView from './previewView.js'
import icons from 'url:../../img/icons.svg';

class resultsView extends PreviewView{
    constructor(){
        super();
        this.setParentElement = document.querySelector('.search-result__list');
        this.setErrorMessage = 'No recipes found for your query! Please try again ;)';
        this.setMessage = '';
    }
}

export default new resultsView();