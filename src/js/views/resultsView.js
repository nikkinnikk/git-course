import { View } from "./Views";
import icons from '../../img/icons.svg';

class ResultView extends View {
    _parentElement = document.querySelector('.results');
    _errorMassage = `No recepes found for your query`;
    _message = '';

    _generateMarkup() {
        return this._data.map(this. _generateMarkupPreview).join('');
        
    }

    _generateMarkupPreview(result) {
        const id = window.location.hash.slice(1);
        return `
            <li class="preview">
                <a class="preview__link ${result.id === id ? 'preview__link--active' : ''} " href="#${result.id}">
                <figure class="preview__fig">
                    <img src="${result.imageUrl}" alt="Test" />
                </figure>
                <div class="preview__data">
                    <h4 class="preview__title">${result.title}</h4>
                    <p class="preview__publisher">${result.publisher}</p>
                    
                </div>
                </a>
            </li>
        `;
    }
}

export default new ResultView;