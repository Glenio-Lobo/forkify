import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View{
    constructor(){
        super();
        this.setParentElement = document.querySelector('.page-arrows');
    }

    _generateMarkup(){
        const numPages = Math.ceil(this.getData.results.length/this.getData.resultsPerPage);

        // 1 Caso: Está na 1 página e não possui mais páginas.
        if(this.getData.page === 1 && numPages === 1) return '';

        // 2 Caso: Está na página 1 e possui mais páginas
        if(this.getData.page === 1 && numPages > 1) return this._generateMarkupNextArrow(this.getData.page+1);

        // 3 Caso: Ultima página
        if(this.getData.page === numPages) return this._generateMarkupPreviousArrow(this.getData.page-1);

        // 4 Caso: Alguma outra página
        return this._generateMarkupPreviousArrow(this.getData.page-1) 
                + this._generateMarkupNextArrow(this.getData.page+1);
    }

    addHandlerClick(handler){
        this.getParentElement.addEventListener('click', function(e){
            const btnClick = e.target.closest('.page-arrow');

            if(!btnClick) return;

            handler(Number(btnClick.dataset.goto));
        });
    }

    _generateMarkupPreviousArrow(page){
        return `<button data-goto=${page} class="page-arrow page-arrows--prev">
                    <svg class="page-arrow--icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${page}</span>
                </button>`;
    }

    _generateMarkupNextArrow(page){
        return `
                <button data-goto=${page} class="page-arrow page-arrows--next">
                    <span>Page ${page}</span>
                    <svg class="page-arrow--icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>`;
    }
}

export default new PaginationView();