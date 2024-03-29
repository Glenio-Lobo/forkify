/**
 * @module View
 * @description Generic class for all views
 */

//@ts-ignore
import icons from 'url:../../img/icons.svg';

/** Class View */
export default class View{
    /** 
     * Parent element of the view object
     * @type {HTMLElement} 
     * */
    #parentElement;
    /**
     *  Error message
     *  @type {string} 
    */
    #errorMessage;
    /**
     *  Success message
     *  @type {string} 
    */
    #message;
    /**
     * Data to be rendered on page
     *  @type {Object}  
    */
    #data;

    /**
     * Renders the data on the page.
     * @param {Object} data 
     */
    render(data){
        if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this.setData = data;
        this.#clear();
        // @ts-ignore
        this.getParentElement.insertAdjacentHTML('afterbegin', this._generateMarkup());
    }

    /**
     * Updates the view with new data
     * @param {Object} data 
     */
    update(data){
        this.setData = data;
        // @ts-ignore
        const newMarkup = this._generateMarkup();

        //Cria um range com todos os nodes do novo markup gerado
        const newDom = document.createRange().createContextualFragment(newMarkup);

        //Criando array contendo todos os elementos do novo markup
        const newElementsGroup = Array.from(newDom.querySelectorAll('*'));
        const oldElementsGroup = Array.from(this.getParentElement.querySelectorAll('*'));


        newElementsGroup.forEach( (newEl, i) => {
            const curEl = oldElementsGroup[i];

            //Verifica se o conteudo dos nodes mudou e se o conteúdo dentro dele é apenas texto!
            // @ts-ignore
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

    /**
     * Clears the view
     */
    #clear(){
        this.getParentElement.innerHTML = '';
    }

    /**
     * Render a loading spinner
     */
    renderSpinner(){
        const spinner = `<div class="loading">
                        <svg>
                        <use href="${icons}#icon-loader"></use>
                        </svg>
                    </div>`;
        this.#clear();
        this.getParentElement.insertAdjacentHTML('afterbegin', spinner);
    }


    /**
     * Renders a error
     * @param {string} [errorMessage=this.getErrorMessage] 
     */
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
    /**
     * Renders a success message
     * @param {string} [message=this.getMessage] 
     */
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

    /**
     * Returns the view data
     * @returns {Object}
     */
    get getData(){
        return this.#data;
    }

    /**
     * Set a new data
     */
    set setData(data){
        this.#data = data;
    }

    /**
     * Returns the view error message
     * @returns {string} 
     */
    get getErrorMessage(){
        return this.#errorMessage;
    }

    /** Sets a new error message */
    set setErrorMessage(errorMessage){
        this.#errorMessage = errorMessage;
    }

    /**
     * Get the success message
     * @returns {string}
     */
    get getMessage(){
        return this.#message;
    }

    /** Sets a new success message  */
    set setMessage(message){
        this.#message = message;
    }

    /**
     * Returns the view parent element
     * @returns {HTMLElement}
     */
    get getParentElement(){
        return this.#parentElement;
    }

    /** Sets a new parent element for the view */
    set setParentElement(parentElement){
        this.#parentElement = parentElement;
    }

}