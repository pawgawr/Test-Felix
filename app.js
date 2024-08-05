document.addEventListener('DOMContentLoaded', loadTodos);
document.getElementById('todo-form').addEventListener('submit', addTodo);
document.getElementById('filter-todo').addEventListener('change', filterTodos);

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(todo => displayTodo(todo));
}

function addTodo(e) {
  e.preventDefault();
  const todoInput = document.getElementById('todo-input');
  const todoText = todoInput.value.trim();
  if (todoText) {
    const todo = {
      text: todoText,
      completed: false,
      date: new Date().toLocaleDateString()
    };
    saveTodoToLocal(todo);
    displayTodo(todo);
    todoInput.value = '';
  }
}

function saveTodoToLocal(todo) {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.push(todo);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function displayTodo(todo) {
  const todoList = document.getElementById('todo-list');
  const todoItem = document.createElement('li');
  todoItem.classList.add('todo-item');
  todoItem.innerHTML = `
    <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
    <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
    <button class="delete-btn"><i class="fas fa-trash"></i></button>
  `;
  todoItem.querySelector('.todo-checkbox').addEventListener('change', () => toggleComplete(todoItem, todo));
  todoItem.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todoItem, todo));
  todoList.appendChild(todoItem);
}

function toggleComplete(todoItem, todo) {
  todo.completed = !todo.completed;
  todoItem.querySelector('.todo-text').classList.toggle('completed');
  updateLocalStorage();
}

function deleteTodo(todoItem, todo) {
  todoItem.remove();
  const todos = JSON.parse(localStorage.getItem('todos')).filter(t => t.text !== todo.text);
  localStorage.setItem('todos', JSON.stringify(todos));
}

function filterTodos() {
  const filterValue = document.getElementById('filter-todo').value;
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  const todoList = document.getElementById('todo-list');
  todoList.innerHTML = '';
  todos.forEach(todo => {
    if (filterValue === 'all' || 
        (filterValue === 'completed' && todo.completed) || 
        (filterValue === 'uncompleted' && !todo.completed)) {
      displayTodo(todo);
    }
  });
}

function updateLocalStorage() {
  const todos = Array.from(document.querySelectorAll('.todo-item')).map(item => {
    const text = item.querySelector('.todo-text').textContent;
    const completed = item.querySelector('.todo-checkbox').checked;
    return { text, completed, date: new Date().toLocaleDateString() };
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}