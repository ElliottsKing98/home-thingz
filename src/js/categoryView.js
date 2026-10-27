import Storage from "./API.js";

const mainApp = document.querySelector(".main");

// ------------------------- Selecting Category Modal --------------------------
const CategoryModal = document.querySelector(".EditCategorySection");
const CategoryBack = document.querySelector(".EditCategorySection");
const cancelBtnEdit = document.querySelector(".cancelBtnEdit");
const CategoryModTitle = document.querySelector(".EditCatMod__title");

// Selecting the inputs
const editTitleInput = document.querySelector("#editTitle");
const editDesInput = document.querySelector("#editDescription");

// Selecting the Btns
const submitBtnEdit = document.querySelector(".submitBtnEdit");

// ---------------------- Category Inputs options in Inventory ------------------
const CategoryInput = document.querySelector("#CategoryInput");

class CategoryUi {
  constructor() {
    this.id = 0;
    cancelBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeCategoryModal();
    });

    CategoryBack.addEventListener("click", (e) => {
      if (e.target.classList.contains("EditCategorySection"))
        this.closeCategoryModal();
    });

    submitBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.submitBtnLogic();
    });
  }

  setApp() {
    mainApp.innerHTML = `
    <div class="CategoryUi">
        <div class="Category__header">
            <h1>Categories</h1>
            <button class="addCategoryBtn">Add Category</button>
        </div>
        <div class="Category__items">
           
        </div>
    </div>
    `;

    this.HTMLContainer = document.querySelector(".Category__items");
    this.updateDOM();
    // Selecting the add Category button on the main page
    const addCategoryBtn = document.querySelector(".addCategoryBtn");

    addCategoryBtn.addEventListener("click", () => {
      CategoryModTitle.textContent = "Add Category"; // Updating the Modal Title
      this.openCategoryModal();
    });
  }

  openCategoryModal() {
    // Opening the Modal
    CategoryModal.classList.remove("--hidden");
    this.clearInputs();
  }

  closeCategoryModal() {
    // Closing the Modal
    CategoryModal.classList.add("--hidden");
    this.clearInputs();
    this.id = 0;
  }

  createHTML(Category) {
    return `
     <div class="Category__item">
        <div class="Category__item__text">
            <h2 class="title">${Category.title}</h2>
            <p class="description">${Category.description}</p>
        </div>
        <div class="Category__item__icons">
            <svg class="icon editCategoryIcon" data-id=${Category.id}>
                <use xlink:href="../assets/images/sprite.svg#editIcon"></use>
            </svg>
            <img
                src="../assets/images/deleteIcon.svg"
                alt="delete Icon"
                class="deleteBtnCategory"
                data-id=${Category.id}
            />
        </div>
    </div>`;
  }

  submitBtnLogic() {
    // Checking if the input are empty or not
    if (editDesInput.value == "" || editTitleInput.value == "") {
      alert("Please Enter all of the fields!");
      return -1;
    }

    // checking for duplication
    if (this.id != 0) {
      const allCategories = Storage.getCategories();
      const otherCategories = allCategories.filter(
        (Category) => Category.id != this.id
      );
      const existed = otherCategories.find(
        (Category) =>
          Category.title.toLowerCase().trim() ==
          editTitleInput.value.toLowerCase().trim()
      );
      if (existed) {
        alert("Category already Exist");
        return -1;
      }
    }

    // Saving the data to localstorage
    Storage.saveCategorie({
      id: this.id,
      title: editTitleInput.value,
      description: editDesInput.value,
    });

    this.id = 0;

    // Update the DOM
    this.updateDOM();

    // Closing the Modal
    this.closeCategoryModal();
  }

  updateDOM() {
    // Creating html for each Category
    let result = "";
    const allCategories = Storage.getCategories();
    allCategories.forEach((Category) => {
      result += this.createHTML(Category);
    });

    this.HTMLContainer.innerHTML = result; // Updating the DOM

    this.updateCategoryOptions();

    // Selecting the delete Icon
    const deleteBtns = document.querySelectorAll(".deleteBtnCategory");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.deleteCategory(id);
      });
    });

    // Selecting the edit Icon
    const editBtns = document.querySelectorAll(".editCategoryIcon");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.editCategory(id);
      });
    });
  }

  clearInputs() {
    // Clearing the inputs values
    [editDesInput, editTitleInput].forEach((input) => {
      input.value = "";
    });
  }

  deleteCategory(id) {
    // Deleting the Category
    Storage.deleteCategory(id);
    this.updateDOM();
  }

  editCategory(id) {
    const allCategories = Storage.getCategories();

    const selectedCategory = allCategories.find(
      (Category) => Category.id == id
    );

    // Setting the new id so we can change only this id
    this.id = id;

    // Update the title of the modal
    CategoryModTitle.textContent = "Edit Category";

    // Opening the Modal
    this.openCategoryModal();

    // Updating the values
    editTitleInput.value = selectedCategory.title;
    editDesInput.value = selectedCategory.description;
  }

  updateCategoryOptions() {
    // Updating the Options Category in the Inventory
    let result = `<option value="">Select product Category</option>
    <option value="no-cat">No Category</option>`;
    // Getting all the value
    const allCategories = Storage.getCategories();
    allCategories.forEach((Category) => {
      result += `<option value=${Category.id}>${Category.title}</option>`;
    });

    // Updating the DOM
    CategoryInput.innerHTML = result;
  }
}

export default new CategoryUi();
