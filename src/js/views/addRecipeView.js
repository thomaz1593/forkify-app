/* FILE THAT RENDERS ADD RECIPE FORM  */

import View from './view.js';
import icons from 'url:../../img/icons.svg'; // // IMPORTING SVG IMG/ICONS TO PARCEL 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded!';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super(); // NECESSARY TO USE .THIS BECAUSE THIS IS A CHILD CLASS
    this._addHandlerShowWindow(); // WHEN PAGE LOADS, CALL THIS FUNCTION
    this._addHandlerHideWindow(); // WHEN PAGE LOADS, CALL THIS FUNCTION
  }

  toggleWindow() {
    // WHEN BUTTON CLICKED, REMOVE HIDDEN CLASS IF EXISTS, IF NOT ADD IT
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    // MANUALLY BINDING THE THIS KEYWORD TO THE THIS OF CALLED FUNCTION -> TOGGLEWINDOW
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    // MANUALLY BINDING THE THIS KEYWORD TO THE THIS OF CALLED FUNCTION -> TOGGLEWINDOW
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // HANDLER FOR THE UPLOAD BUTTON OF THE FORM
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // GET ALL THE INPUT VALUES
      const dataArray = [...new FormData(this)]; // THIS POINTS TO THE THIS OF HANDLER -> PARENTELEMENT
      const data = Object.fromEntries(dataArray); // CONVERTS ARRAY INTO AN OBJECT
      handler(data);
    });
  }

  _generateMarkup() {}
}

// EXPORTING OBJECT (CLASS) RECIPEVIEW. ITS LIKE A NEW INSTANCE
export default new AddRecipeView();
