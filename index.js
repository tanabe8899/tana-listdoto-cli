const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const chalk = require('chalk');
const readlineSync = require('readline-sync');

const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ todos: [] }).write();

function addTodo() {
  const task = readlineSync.question('Enter your task: ');
  db.get('todos').push({ id: Date.now(), task, done: false }).write();
  console.log(chalk.green('Task added successfully.'));
}

function listTodos() {
  const todos = db.get('todos').value();
  todos.forEach(todo => {
    console.log(`${todo.id}: ${todo.task} - ${todo.done ? chalk.strikethrough('Done') : 'Pending'}`);
  });
}

function toggleTodo() {
  const id = readlineSync.questionInt('Enter task ID to toggle: ');
  const todo = db.get('todos').find({ id }).value();
  if (todo) {
    db.get('todos').find({ id }).assign({ done: !todo.done }).write();
    console.log(chalk.blue('Task status updated.'));
  } else {
    console.log(chalk.red('Task not found.'));
  }
}

function deleteTodo() {
  const id = readlineSync.questionInt('Enter task ID to delete: ');
  db.get('todos').remove({ id }).write();
  console.log(chalk.red('Task deleted.'));
}

function mainMenu() {
  console.log(chalk.cyan('\nTodo List Manager'));
  const choices = ['Add task', 'List tasks', 'Toggle task completion', 'Delete task', 'Exit'];
  const index = readlineSync.keyInSelect(choices, 'Choose an option:');
  switch (index) {
    case 0:
      addTodo();
      break;
    case 1:
      listTodos();
      break;
    case 2:
      toggleTodo();
      break;
    case 3:
      deleteTodo();
      break;
    case 4:
      console.log(chalk.magenta('Goodbye!'));
      process.exit();
  }
}

while (true) {
  mainMenu();
}
