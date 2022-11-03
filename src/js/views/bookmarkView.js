import View from './view.js';
import icons from 'url:../../img/icons.svg';
import PreviewView from './previewView.js'

class BookmarkView extends PreviewView{
    constructor(){
        super();
        this.setParentElement = document.querySelector('.bookmark__list');
        this.setErrorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
        this.setMessage = '';
    }

    addHandlerRender(handler){
        window.addEventListener('load', function(){
            handler();
        })
    }
}

export default new BookmarkView();