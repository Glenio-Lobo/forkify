import View from './view.js';
import icons from 'url:../../img/icons.svg';

export default class PreviewView extends View{

    _generateMarkup(){
        return this.getData.map(recipe => this._generateMarkupPreview(recipe)).join('');
    }

    _generateMarkupPreview(recipe){
        const id  = window.location.hash.slice(1);

        // console.log('Recipe being rendered: ', this.getData);

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
