import icons from 'url:../../img/icons.svg';

export default class View{
    #parentElement;
    #errorMessage;
    #message;
    #data;

    render(data){
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this.setData = data;
        this.#clear();
        this.getParentElement.insertAdjacentHTML('afterbegin', this._generateMarkup());
    }

    update(data){
        this.setData = data;
        const newMarkup = this._generateMarkup();

        //Cria um range com todos os nodes do novo markup gerado
        const newDom = document.createRange().createContextualFragment(newMarkup);

        //Criando array contendo todos os elementos do novo markup
        const newElementsGroup = Array.from(newDom.querySelectorAll('*'));
        const oldElementsGroup = Array.from(this.getParentElement.querySelectorAll('*'));


        newElementsGroup.forEach( (newEl, i) => {
            const curEl = oldElementsGroup[i];

            //Verifica se o conteudo dos nodes mudou e se o conteúdo dentro dele é apenas texto!
            if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
                curEl.textContent = newEl.textContent;
            }

            //Atualizando os atributos
            if(!newEl.isEqualNode(curEl)){
                Array.from(newEl.attributes).forEach( atribute => {
                    curEl.setAttribute(atribute.name, atribute.value);
                });
            }
        });

    }

    #clear(){
        this.getParentElement.innerHTML = '';
    }

    renderSpinner(){
        const spinner = `<div class="loading">
                        <svg>
                        <use href="${icons}#icon-loader"></use>
                        </svg>
                    </div>`;
        this.#clear();
        this.getParentElement.insertAdjacentHTML('afterbegin', spinner);
    }

    renderError(errorMessage = this.getErrorMessage){
        const htmlError = 
            `<div class="error">
                <div>
                    <svg class="recipe__begin__icon">
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                
                <span>${errorMessage}</span>
            </div>`;

        this.#clear();
        this.getParentElement.insertAdjacentHTML('afterbegin', htmlError);
    }

    renderMessage(message = this.getMessage){
        //Menssagem de Sucesso
        const htmlMessage = 
            `<div class="message">
                <div>
                    <svg class="recipe__begin__icon">
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                
                <span>${message}</span>
            </div>`;

        this.#clear();
        this.getParentElement.insertAdjacentHTML('afterbegin', htmlMessage);
    }

    get getData(){
        return this.#data;
    }

    set setData(data){
        this.#data = data;
    }

    get getErrorMessage(){
        return this.#errorMessage;
    }

    set setErrorMessage(errorMessage){
        this.#errorMessage = errorMessage;
    }

    get getMessage(){
        return this.#message;
    }

    set setMessage(message){
        this.#message = message;
    }

    get getParentElement(){
        return this.#parentElement;
    }

    set setParentElement(parentElement){
        this.#parentElement = parentElement;
    }

}