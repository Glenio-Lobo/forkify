class SearchView{
    #parentElement = document.querySelector('.search');

    getQuery(){
        const query = this.#parentElement.querySelector('.search__input').value;
        this.#clearInput();
        return query;
    }

    #clearInput(){
        this.#parentElement.querySelector('.search__input').value = '';
    }

    addHandlerSearch(handler){
        this.#parentElement.addEventListener('submit', function(e){
            e.preventDefault();
            handler();
        });
    }
}

export default new SearchView();