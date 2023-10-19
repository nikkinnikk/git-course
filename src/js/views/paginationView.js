import { View } from "./Views";
import icons from '../../img/icons.svg';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', function(e) {
            const btn = e.target.closest('.btn--inline');

            const goToPage = +btn.dataset.goto;
            handler(goToPage);
        })
    }

    _generateMarkup() {
        // ст 1 больше нет
        const numPage = Math.ceil(this._data.results.length / this._data.resultsPerPage) ;
        const curPage = this._data.page;

        // ст 1 есть ещё
        if(curPage === 1 && numPage > 1) {
            return `
                <button data-goto = "${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                        <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `
        }
        // конец
        if (curPage === numPage && numPage > 1) {
            return `
                <button data-goto = "${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>
            `;
        }
        // середина
        if (curPage < numPage) {
            return `
                <button data-goto = "${curPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${curPage - 1}</span>
                </button>

                <button data-goto = "${curPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${curPage + 1}</span>
                        <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
        // только 1 страница
        return '';
    }
}

export default new PaginationView;