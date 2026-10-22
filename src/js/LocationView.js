import Storage from "./API.js";
//update all Location to location
const mainApp = document.querySelector(".main");

// ------------------------- Selecting Location Modal --------------------------
const LocationModal = document.querySelector(".EditLocationSection");
const LocationBack = document.querySelector(".EditLocationSection");
const cancelBtnEdit = document.querySelector(".cancelBtnEdit");
const LocationModTitle = document.querySelector(".EditLocMod__title");

// Selecting the inputs
const editLocationInput = document.querySelector("#editLocation"); //editTitleInput
const editDesInput = document.querySelector("#editDescription");

// Selecting the Btns
const submitBtnEdit = document.querySelector(".submitBtnEdit");

// ---------------------- Location Inputs options in Inventory ------------------
const LocationInput = document.querySelector("#LocationInput");

class LocationUi {
  constructor() {
    this.id = 0;
    cancelBtnEdit.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeLocationModal();
    });

    LocationBack.addEventListener("click", (e) => {
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
    <div class="LocationUi">
        <div class="Location__header">
            <h1>Locations</h1>
            <button class="addLocationBtn">Add Location</button>
        </div>
        <div class="Location__items">
           
        </div>
    </div>
    `;

    this.HTMLContainer = document.querySelector(".Location__items");
    this.updateDOM();
    // Selecting the add Location button on the main page
    const addLocationBtn = document.querySelector(".addLocationBtn");

    addLocationBtn.addEventListener("click", () => {
      LocationModTitle.textContent = "Add Location"; // Updating the Modal Title
      this.openLocationModal();
    });
  }

  openLocationModal() {
    // Opening the Modal
    LocationModal.classList.remove("--hidden");
    this.clearInputs();
  }

  closeLocationModal() {
    // Closing the Modal
    LocationModal.classList.add("--hidden");
    this.clearInputs();
    this.id = 0;
  }

  createHTML(Location) {
    return `
     <div class="Location__item">
        <div class="Location__item__text">
            <h2 class="title">${Location.title}</h2>
            <p class="description">${Location.description}</p>
        </div>
        <div class="Location__item__icons">
            <svg class="icon editLocationIcon" data-id=${Location.id}>
                <use xlink:href="../assets/images/sprite.svg#editIcon"></use>
            </svg>
            <img
                src="../assets/images/deleteIcon.svg"
                alt="delete Icon"
                class="deleteBtnLocation"
                data-id=${Location.id}
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
        (Location) => Location.id != this.id
      );
      const existed = otherLocations.find(
        (Location) =>
          Location.title.toLowerCase().trim() ==
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
    // Creating html for each Location
    let result = "";
    const allLocations = Storage.getLocations();
    allLocations.forEach((Location) => {
      result += this.createHTML(Location);
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
    // Deleting the Location
    Storage.deleteLocation(id);
    this.updateDOM();
  }

  editLocation(id) {
    const allLocations = Storage.getLocations();

    const selectedLocation = allLocations.find(
      (Location) => Location.id == id
    );

    // Setting the new id so we can change only this id
    this.id = id;

    // Update the title of the modal
    LocationModTitle.textContent = "Edit Location";

    // Opening the Modal
    this.openLocationModal();

    // Updating the values
    editTitleInput.value = selectedLocation.title;
    editDesInput.value = selectedLocation.description;
  }

  updateLocationOptions() {
    // Updating the Options Location in the Inventory
    let result = `<option value="">Select product Location</option>
    <option value="no-loc">No Location</option>`;
    // Getting all the value
    const allLocations = Storage.getLocations();
    allLocations.forEach((Location) => {
      result += `<option value=${Location.id}>${Location.title}</option>`;
    });

    // Updating the DOM
    LocationInput.innerHTML = result;
  }
}

export default new LocationUi();
