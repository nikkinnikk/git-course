import icons from '../../img/icons.svg';

export class View {
    _data;
    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

        this._data = data;
        const marKup = this._generateMarkup();
		this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', marKup);	
    }

    update(data) {
        // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

        this._data = data;
        const newMarKup = this._generateMarkup();

        const newDom = document.createRange().createContextualFragment(newMarKup);
        const newElements = Array.from(newDom.querySelectorAll('*')) ;
        const curElements = Array.from(this._parentElement.querySelectorAll('*')) ;

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }

            if(!newEl.isEqualNode(curEl)) {
                Array.from(newEl.attributes).forEach(attr => {
                    curEl.setAttribute(attr.name, attr.value)
                })
            }
        })
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }
    renderSpinner() {
        const markUp = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div> 
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }
    renderError(message = this._errorMassage) {
        const markUp = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}!</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }

    renderMassage(message = this._errorMassage) {
        const markUp = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}!</p>
            </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markUp);
    }

}