const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");
const itemClear = document.getElementById("clear");
const itemFilter = document.getElementById("filter");


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

function removeItem(e) {
    if (e.target.parentElement.classList.contains("remove-item")) {
        if (confirm("Are you sure?")) {
            e.target.parentElement.parentElement.remove();
            checkUI();
        };
    };
};

function clearItems(e) {
    if (confirm("Are you sure?")) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        };
        checkUI();
    };
};

function checkUI() {
    const items = itemList.querySelectorAll("li");
    if (items.length === 0){
        itemClear.style.display = "none";
        itemFilter.style.display = "none";
    } else {
        itemClear.style.display = "block";
        itemFilter.style.display = "block";
    };
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
    itemList.addEventListener("click", removeItem);
    itemClear.addEventListener("click", clearItems);
    itemFilter.addEventListener("input", filterItems);
    document.addEventListener("DOMContentLoaded", displayItems);
    checkUI();
};

init();