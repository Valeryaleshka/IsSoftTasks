const $todoItem = document.getElementById("ToDoInput");
const $list = document.getElementById("list-items-wrapper");
let userID, todolist, url;

document.addEventListener("click", addItem);
document.addEventListener("click", changeStatus);
document.addEventListener("click", deleteItem);

init();

function addItem(e) {
  if (e.target.classList.contains("addNewItem")) {
    e.preventDefault();

    const inputValue = $todoItem.value.trim();
    if (inputValue != "") {
      const todoItemValue = $todoItem.value;
      $todoItem.value = ""; // clear $todoItem

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: todoItemValue }),
      })
        .then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              todolist = data;
              $list.appendChild(createElement(data[data.length - 1]));
              $todoItem.focus();
            });
          }
        })
        .catch(function (error) {
          console.warn(error);
        });
    }
  }
}

function changeStatus(e) {
  if (
    e.target.closest(".list-item") &&
    !e.target.classList.contains("delete-item")
  ) {
    const $element = e.target.closest(".list-item");
    const selectedItem = getSelectedItem($element);

    selectedItem.status === "new"
      ? (selectedItem.status = "done")
      : (selectedItem.status = "new");

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedItem),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            todolist = data;
            $element.classList.toggle("item-checked");
          });
        }
      })
      .catch(function (error) {
        console.warn(error);
      });
  }
}

function deleteItem(e) {
  if (e.target.classList.contains("delete-item")) {
    const $element = e.target.closest(".list-item");
    const selectedItem = getSelectedItem($element);

    fetch(url + "/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedItem),
    })
      .then((response) => {
        if (response.ok) {
          deleteItemAnimation($element);
        }
      })
      .catch(function (error) {
        console.warn(error);
      });
  }
}

function init() {
  getUserID();
  initMainURL();
  fetch(url).then((response) =>
    response.json().then((data) => {
      console.log(data)
      todolist = data;
      data.forEach((element) => {
        $list.appendChild(createElement(element));
      });
    })
  );
}

function getUserID() {
  if (localStorage.getItem("userID")) {
    userID = localStorage.getItem("userID");
  } else {
    userID = generateID();
    localStorage.setItem("userID", userID);
  }
}

function initMainURL() {
  url = "http://jsfeajax.herokuapp.com/" + userID + "/todo";
}

function deleteItemAnimation($element) {
  $element.classList.toggle("item-deleted");
  setTimeout(() => deleteElement($element), 300);

  function deleteElement($el) {
    $el.classList.add("item-cleared-space");
    setTimeout(() => $el.remove(), 300);
  }
}

function getSelectedItem(element) {
  const selectedItemIndex = todolist.findIndex(
    (item) => item.id === element.dataset.id
  );
  return todolist[selectedItemIndex];
}

function generateID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function createElement(element) {
  const $button = document.createElement("button");
  $button.classList.add("delete-item");
  $button.innerText = "Delete";

  const $p = document.createElement("p");
  $p.classList.add("list-item-text");
  $p.textContent = element.text;

  const $li = document.createElement("li");
  $li.classList.add("list-item");
  $li.dataset.id = element.id;
  if (element.status === "done") {
    $li.classList.add("item-checked");
  }

  $li.appendChild($p);
  $li.appendChild($button);

  return $li;
}
