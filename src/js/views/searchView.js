/** 
 * @module searchView
 * @description View of the user search
 */

/** SeachView Class */
class SearchView{
    /** 
     * Search view parent element
     * @type {HTMLElement} 
     * */
    // @ts-ignore
    #parentElement = document.querySelector('.search');

    /** 
     * Returns the user query
     * @returns {string} User Query
     */
    getQuery(){
        // @ts-ignore
        const query = this.#parentElement.querySelector('.search__input').value;
        this.#clearInput();
        return query;
    }

    /** Clears the input region */
    #clearInput(){
        // @ts-ignore
        this.#parentElement.querySelector('.search__input').value = '';
    }

    /**
     * Adds a listeners for the submit event so the search input.
     * @param {function} handler 
     */
    addHandlerSearch(handler){
        this.#parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();