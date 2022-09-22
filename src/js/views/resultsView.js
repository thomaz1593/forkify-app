/* FILE THAT RENDERS THE RESULTS OF THE SEARCH ON SIDEBAR */

import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg'; // // IMPORTING SVG IMG/ICONS TO PARCEL 2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your search. Please try again!';
  _message = '';

  _generateMarkup() {
    // LOOP THROUGH DATA AND RENDERS EACH RESULT
    // SET TO FALSE SO IT NOT RETURN A STRING BUT AN ARRAY
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  // _generateMarkup() {
  //   return this._data.map(this._generateMarkupPreview).join('');
  // }

  // _generateMarkupPreview(result) {
  //   // STORE THE CURRENT ID OF RECIPE
  //   const id = window.location.hash.slice(1);
  //   // AND IF IT MATCHES, USE THE UPDATE METHOD TO ADD HIGHLIGHT CLASS TO ELEMENT
  //   return `
  //       <li class="preview">
  //           <a class="preview__link ${
  //             result.id === id ? 'preview__link--active' : ''
  //           }" href="#${result.id}">
  //           <figure class="preview__fig">
  //               <img src="${result.image}" alt="${result.title}" />
  //           </figure>
  //           <div class="preview__data">
  //               <h4 class="preview__title">${result.title}</h4>
  //               <p class="preview__publisher">${result.publisher}</p>
  //           </div>
  //           </a>
  //       </li>
  //   `;
  // }
}

// EXPORTING OBJECT (CLASS) RESULTSVIEW. ITS LIKE A NEW INSTANCE
export default new ResultsView();
