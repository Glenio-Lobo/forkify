/**
 * @module bookmarkView
 * @description View that generates the html for the recipe previews viewed on the bookmarks list
 */
import View from './view.js';
//@ts-ignore
import icons from 'url:../../img/icons.svg';
import PreviewView from './previewView.js'

/**
 * BookmarkView Class
 * @extends PreviewView
 */
class BookmarkView extends PreviewView{
    /** Creates a new BookmarkView object */
    constructor(){
        super();
        this.setParentElement = document.querySelector('.bookmark__list');
        this.setErrorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
        this.setMessage = '';
    }

    /**
     * Adds a listener on the window load event that runs the handler.
     * @param {function} handler 
     */
    addHandlerRender(handler){
        window.addEventListener('load', function(){
            handler();
        })
    }
}

export default new BookmarkView();