const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemClear = document.getElementById("clear");
const itemFilter = document.getElementById("filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;

function displayItems () {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
};

function onAddItemSubmit(e) {
    e.preventDefault();
    
    const newItem = itemInput.value;
    if (itemInput.value === "") {
        alert("Please add item");
        return;
    };

    if (isEditMode) {
        const itemToEdit = itemList.querySelector(".edit-mode");
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove("edit-mode");
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert("Item already exists");
            return;
        };
    };
    addItemToDOM(newItem);
    addItemToStorage(newItem);
    checkUI();
};

function addItemToDOM(item) {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(item));

    const button = createButton("remove-item btn-link text-red");
    li.appendChild(button);
    itemList.appendChild(li);
};

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    
    itemsFromStorage.push(item);
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem("items") === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem("items"));
    };
    return itemsFromStorage;
};

function createButton(classes) {
    const button = document.createElement("button");
    button.className = classes;
    const icon = createIcon("fa-solid fa-xmark");
    button.appendChild(icon);
    return button;
};

function createIcon(classes) {
    const icon = document.createElement("i");
    icon.className = classes;
    return icon;
};

function onClickItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        if (e.target.classList.contains("items")) {
            return;
        } else {
            setItemToEdit(e.target);
        };
        //fixed
        //clicking on ul area which is not li area bugs the whole thing, fixed by reload
    };
};

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
};

function setItemToEdit(item) {
    isEditMode = true;
    itemList
        .querySelectorAll("li")
        .forEach((i) => i.classList.remove("edit-mode"));
    item.classList.add("edit-mode");
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = "#123";
    itemInput.value = item.textContent;
};

function removeItem(item) {
    if (confirm("Are you sure?")) {
        item.remove();
        checkUI();
        removeItemFromStorage(item.textContent);
    };
};

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    localStorage.setItem("items", JSON.stringify(itemsFromStorage));
};

function clearItems() {
    if (confirm("Are you sure?")) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        };
        localStorage.removeItem("items");
        checkUI();
    };
};

function checkUI() {
    itemInput.value = "";
    const items = itemList.querySelectorAll("li");
    if (items.length === 0){
        itemClear.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        itemClear.style.display = "block";
        itemFilter.style.display = "block";
    };
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = "#333";
    isEditMode = false;

};

function filterItems(e) {
    const items = itemList.querySelectorAll("li");
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) != -1) { //index of checks every letter without the need of a loop
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        };
    });
};

//init app
function init() {
    itemForm.addEventListener("submit", onAddItemSubmit);
    itemList.addEventListener("click", onClickItem);
    itemClear.addEventListener("click", clearItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);
    checkUI();
};

init();