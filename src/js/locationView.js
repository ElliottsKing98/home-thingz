import Storage from "./API.js";

const mainApp = document.querySelector(".main");

// ------------------------- Selecting location Modal --------------------------
const locationModal = document.querySelector(".EditLocationSection");
const locationBack = document.querySelector(".EditLocationSection");
const cancelBtnEdit = document.querySelector(".cancelBtnEdit");
const locationModTitle = document.querySelector(".EditLocMod__title");

// Selecting the inputs
const editTitleInput = document.querySelector("#editTitle");
const editDesInput = document.querySelector("#editDescription");

// Selecting the Btns
const submitBtnEdit = document.querySelector(".submitBtnEdit");

// ---------------------- Location Inputs options in Inventory ------------------
const locationInput = document.querySelector("#locationInput");

class LocationUi {
  constructor() {
    this.id = 0;
    cancelBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeLocationModal();
    });

    locationBack.addEventListener("click", (e) => {
      if (e.target.classList.contains("EditLocationSection"))
        this.closeLocationModal();
    });

    submitBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.submitBtnLogic();
    });
  }

  setApp() {
    mainApp.innerHTML = `
    <div class="locationUi">
        <div class="location__header">
            <h1>Locations</h1>
            <button class="addlocationBtn">Add Location</button>
        </div>
        <div class="location__items">
           
        </div>
    </div>
    `;

    this.HTMLContainer = document.querySelector(".location__items");
    this.updateDOM();
    // Selecting the add Location button on the main page
    const addLocationBtn = document.querySelector(".addLocationBtn");

    addLocationBtn.addEventListener("click", () => {
      locationModTitle.textContent = "Add Location"; // Updating the Modal Title
      this.openLocationModal();
    });
  }

  openLocationModal() {
    // Opening the Modal
    locationModal.classList.remove("--hidden");
    this.clearInputs();
  }

  closeLocationModal() {
    // Closing the Modal
    locationModal.classList.add("--hidden");
    this.clearInputs();
    this.id = 0;
  }

  createHTML(location) {
    return `
     <div class="location__item">
        <div class="location__item__text">
            <h2 class="title">${location.title}</h2>
            <p class="description">${location.description}</p>
        </div>
        <div class="location__item__icons">
            <svg class="icon editLocationIcon" data-id=${location.id}>
                <use xlink:href="../assets/images/sprite.svg#editIcon"></use>
            </svg>
            <img
                src="../assets/images/deleteIcon.svg"
                alt="delete Icon"
                class="deleteBtnLocation"
                data-id=${location.id}
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
      const allLocations = Storage.getLocations();
      const otherLocations = allLocations.filter(
        (location) => location.id != this.id
      );
      const existed = otherLocations.find(
        (location) =>
          location.title.toLowerCase().trim() ==
          editTitleInput.value.toLowerCase().trim()
      );
      if (existed) {
        alert("Location already Exist");
        return -1;
      }
    }

    // Saving the data to localstorage
    Storage.saveLocation({
      id: this.id,
      title: editTitleInput.value,
      description: editDesInput.value,
    });

    this.id = 0;

    // Update the DOM
    this.updateDOM();

    // Closing the Modal
    this.closeLocationModal();
  }

  updateDOM() {
    // Creating html for each location
    let result = "";
    const allLocations = Storage.getLocations();
    allLocations.forEach((location) => {
      result += this.createHTML(location);
    });

    this.HTMLContainer.innerHTML = result; // Updating the DOM

    this.updateLocationOptions();

    // Selecting the delete Icon
    const deleteBtns = document.querySelectorAll(".deleteBtnLocation");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.deleteLocation(id);
      });
    });

    // Selecting the edit Icon
    const editBtns = document.querySelectorAll(".editLocationIcon");
    editBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = Number(e.target.dataset.id);
        this.editLocation(id);
      });
    });
  }

  clearInputs() {
    // Clearing the inputs values
    [editDesInput, editTitleInput].forEach((input) => {
      input.value = "";
    });
  }

  deleteLocation(id) {
    // Deleting the location
    Storage.deleteLocation(id);
    this.updateDOM();
  }

  editLocation(id) {
    const allLocations = Storage.getLocations();

    const selectedLocation = allLocations.find(
      (location) => location.id == id
    );

    // Setting the new id so we can change only this id
    this.id = id;

    // Update the title of the modal
    locationModTitle.textContent = "Edit Location";

    // Opening the Modal
    this.openLocationModal();

    // Updating the values
    editTitleInput.value = selectedLocation.title;
    editDesInput.value = selectedLocation.description;
  }

  updateLocationOptions() {
    // Updating the Options location in the Inventory
    let result = `<option value="">Select product location</option>
    <option value="no-loc">No Location</option>`;
    // Getting all the value
    const allLocations = Storage.getLocations();
    allLocations.forEach((location) => {
      result += `<option value=${location.id}>${location.title}</option>`;
    });

    // Updating the DOM
    locationInput.innerHTML = result;
  }
}

export default new LocationUi();
