/* FILE THAT IS THE PARENT PREVIEW ELEMENT FROM BOOKMARKSVIEW AND RESULTSVIEW 
GENERATE THE MARKUP FOR ONE OF THESE PREVIEW VIEWS ELEMENTS */

import View from './view.js';
import icons from 'url:../../img/icons.svg'; // // IMPORTING SVG IMG/ICONS TO PARCEL 2

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup() {
    // STORE THE CURRENT ID OF RECIPE
    const id = window.location.hash.slice(1);
    // AND IF IT MATCHES, USE THE UPDATE METHOD TO ADD HIGHLIGHT CLASS TO ELEMENT
    return `
        <li class="preview">
            <a class="preview__link ${
              this._data.id === id ? 'preview__link--active' : ''
            }" href="#${this._data.id}">
              <figure class="preview__fig">
                  <img src="${this._data.image}" alt="${this._data.title}" />
              </figure>
              <div class="preview__data">
                  <h4 class="preview__title">${this._data.title}</h4>
                  <p class="preview__publisher">${this._data.publisher}</p>
                  <div class="preview__user-generated ${
                    this._data.key ? '' : 'hidden'
                  }">
                    <svg>
                      <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
              </div>
            </a>
        </li>
    `;
  }
}

// EXPORTING OBJECT (CLASS) PREVIEWVIEW. ITS LIKE A NEW INSTANCE
export default new PreviewView();
