class SearchView {
    _parentElement = document.querySelector('.search');
    _data;
    _errorMassage = `We could fine reciept. Please try another one! `;
    _message = '';

    getQuery() {
        const query =  this._parentElement.querySelector('.search__field').value;
        this._clearInput();
        return query
    }

    _clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }
    
    addHandlerSearch(handler) {
        this._parentElement.addEventListener('submit', function(e) {
            e.preventDefault();
            handler();
        })
    }
}

export default new SearchView;