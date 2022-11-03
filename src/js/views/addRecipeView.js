import View from './view.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View{
    #window = document.querySelector('.add-recipe');
    #overlay = document.querySelector('.overlay');
    #closeBtn = document.querySelector('.btn--close');
    #openBtn = document.querySelector('.navlist__btn--add--recipe');

    constructor(){
        super();
        this.setParentElement = document.querySelector('.upload');
        this.setMessage = 'Recipe was succesfully uploaded ;)';

        this.#addHandlerShowWindow();
        this.#addHandlerCloseWindow();
    }

    #addHandlerShowWindow(){
        this.#openBtn.addEventListener('click', this.toggleWindow.bind(this));
    }

    #addHandlerCloseWindow(){
        this.#closeBtn.addEventListener('click', this.toggleWindow.bind(this));
        this.#overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler){
        this.getParentElement.addEventListener('submit', function(e){
            e.preventDefault();
            let data = [...new FormData(this)];
            data = Object.fromEntries(data);
            handler(data);
        })
    }

    toggleWindow(){
        this.#window.classList.toggle('hidden');
        this.#overlay.classList.toggle('hidden');
    }
}

export default new AddRecipeView();