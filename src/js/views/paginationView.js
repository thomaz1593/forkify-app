/* FILE THAT RENDERS PAGINATION FOR SEARCH RESULTS */

import View from './view.js';
import icons from 'url:../../img/icons.svg'; // // IMPORTING SVG IMG/ICONS TO PARCEL 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  //   PUBLISHER-SUBSCRIBER PATTERN -> HANDLERCLICK AS PUBLISHER
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      /* EVENT DELEGATION TO DISCOVER WHICH BUTTON WAS CLICKED 
      SEARCHING THE CLOSEST FROM PARENT ELEMENT BTN-INLINE */
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      // STORE DATA-GOTO PROPERTY AND CONVERT TO NUMBER
      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    // STORE HOW MANY PAGES THERE ARE AND ROUND THE NUMBER TO UPPER VALUE
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // PROPERTY DATA-GOTO TO DOM KNOWS WHERE SHOULD GO WHEN BUTTON CLICKED
    // PAGE 1 AND THERE ARE OTHERS PAGES
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    // LAST PAGE
    if (currentPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }
    // OTHER PAGE
    if (currentPage < numPages) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
    }
    // PAGE 1 AND THERE ARE NOT OTHERS PAGES
    return '';
  }
}

// EXPORTING OBJECT (CLASS) RECIPEVIEW. ITS LIKE A NEW INSTANCE
export default new PaginationView();
