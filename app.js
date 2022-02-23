// SELECT ITEMS
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');
// edit option
let editElement;
let editFlag = false;
let editID = "";
// event listeners
form.addEventListener('submit',addItem)
//clear items
clearBtn.addEventListener('click', clearItems);
//load items
window.addEventListener('DOMContentLoaded', setupItems);
const deleteBtn = document.querySelector(".delete-btn");
console.log(deleteBtn);
//functions
function addItem(e){
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if(value !== '' && editFlag === false){
        createListItem(id, value)
        //display alert
        displayAlert("Przedmiot dodany do listy", "sukces")
        //show container
        container.classList.add("show-container");
        //add to local storage
        addToLocalStorage(id, value);
        //set back to default
        setBackToDefault()
    }
    else if(value !== '' && editFlag === true){
        editElement.innerHTML = value;
        displayAlert('Wartość zmieniona', 'powiodło się')
        // edit local storage
        editLocalStorage(editID, value)
        setBackToDefault()
    }
    else{
        displayAlert("Proszę dodać wartość", "błąd");
    }
}
//display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    //remove alert
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000)
}
//clear items
function clearItems(){
    const items = document.querySelectorAll('.grocery-item');

    if(items.length > 0){
        items.forEach(function (item){
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlertAlert("Pusta lista", "błąd");
    setBackToDefault();
}
//set back to defualt
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = ""
    submitBtn.textContent = "Dodaj";
}
// local storage
function addToLocalStorage(id, value){
    const grocery = {id, value};
    let items = localStorage.getItem("list")?JSON.parse(localStorage.getItem("list")):[];

    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));
}
function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
        if(item.id !==id){
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    })
}
function getLocalStorage(){
    return localStorage.getItem("list")? JSON.parse(localStorage.getItem("list")): [];
}
//edit function
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent= "edit";
}
//delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlert('Przedmiot usunięty', "błąd");
    setBackToDefault();
    //remove from local storage
    removeFromLocalStorage(id);
}
//save as strings
localStorage.setItem('orange',JSON.stringify(["item", "item2"]));
const oranges = JSON.parse*(localStorage.getItem('orange'));
localStorage.removeItem('orange');
// setup items
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value)
        })
        container.classList.add("show-container")
    }
}
function createListItem(id, value){       
    const element = document.createElement('article');
    //add class
    element.classList.add('grocery-item');
    //add id
    const attr = document.createAttribute('data-id')
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `    <p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>`;
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click',editItem);
    //append child
    list.appendChild(element);}