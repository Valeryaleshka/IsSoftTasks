const fs = require("fs");
const yargs = require("yargs");
const itemNumberRegExp = new RegExp(/{{.+?}}/g);
const itemStatusRegExp = new RegExp(/<<.+>>/g);
const todoItemRegExp = new RegExp(/\{\{.+?>>/g);

const argv = yargs
  .command(
    "list",
    "Display todoList command 'list'",
    () => {},
    () => {
      showList();
    }
  )
  .command(
    "add",
    "Add new todoItem command 'add item'",
    () => {},
    (argv) => {
      addTodoListItem(argv);
    }
  )
  .command(
    "status",
    "Change status item command 'status numberOfItem'",
    () => {},
    (argv) => {
      changeItemStatus(argv);
    }
  )
  .command(
    "delete",
    "Delete item command 'delete numberOfItem'",
    () => {},
    (argv) => deleteToDoItem(argv)
  )
  .command(
    "clear",
    "Clear todoList",
    () => {},
    () => {
      fs.writeFile("todo.txt", "", () => {});
    }
  )
  .help().argv;

function throwError(error) {
  console.warn(error);
  throw error;
}

function getCurrentNumber(matches) {
  if (matches === null) {
    return 1;
  } else {
    return +matches[matches.length - 1].replace("{{", "").replace("}}", "") + 1;
  }
}

function newStatus(match) {
  if (match.match(itemStatusRegExp) == "<<new>>") {
    return match.replace("new", "done");
  } else {
    return match.replace("done", "new");
  }
}

function showList() {
  fs.readFile("todo.txt", "utf8", function (error, contents) {
    if (error) {
      throwError(error);
    }
    const todoItems = contents.match(todoItemRegExp);
    if (todoItems) {
      todoItems.forEach((element) => {
        console.log(
          element
            .replace("{{", "№ ")
            .replace("}}", "")
            .replace("<<", "status <<")
        );
      });
    } else {
      console.log("List is Null");
    }
  });
}

function addTodoListItem(argv) {
  fs.readFile("todo.txt", "utf8", function (error, contents) {
    if (error) {
      throwError(error);
    }
    const inputText = argv._[1];
    if (inputText) {
      const matches = contents.match(itemNumberRegExp);
      const currentNumber = getCurrentNumber(matches);
      const string = "{{" + currentNumber + "}} " + inputText + " <<new>>\n";

      fs.appendFile("todo.txt", string, function (error) {
        if (error) {
          throwError(error);
        }
        console.log("New ToDO Item added");
      });
    }
  });
}

function changeItemStatus(argv) {
  fs.readFile("todo.txt", "utf8", function (error, contents) {
    if (error) {
      throwError(error);
    }
    const currentItem = new RegExp("{{" + argv._[1] + ".+?>>");
    const match = contents.match(currentItem);

    if (match) {
      const newItem = newStatus(match[0]);
      const string = contents.replace(match[0], newItem);
      fs.writeFile("todo.txt", string, function (error) {
        if (error) {
          throwError(error);
        }
      });
    }
  });
}

function deleteToDoItem(argv) {
  fs.readFile("todo.txt", "utf8", function (error, contents) {
    if (error) {
      throwError(error);
    }
    const selectedItemRegExp = new RegExp("{{" + argv._[1] + ".+?>>");
    const arrayOfItems = contents.split("\n").filter((element) => {
      return !element.match(selectedItemRegExp);
    });
    const structuredArrayOfItems = sequentialNumbers(arrayOfItems);
    const arrayOfItemToString = structuredArrayOfItems.join("\n") + "\n".trim();

    fs.writeFile("todo.txt", arrayOfItemToString, function (error) {
      if (error) {
        throwError(error);
      }
    });
  });
}

function sequentialNumbers(arr) {
  let currentNumber = 1;
  for (let i = 0; i < arr.length - 1; i++) {
    arr[i] = arr[i].replace(itemNumberRegExp, "{{" + currentNumber + "}}");
    currentNumber++;
  }
  return arr;
}
