"use strict";
class User {
    constructor(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
class Task {
    constructor(id, title, description, assignedTo) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assignedTo = assignedTo;
    }
}
class UserService {
    constructor() {
        this.users = [];
        this.lastUserId = 0;
    }
    createUser(name, email) {
        const newUser = new User(++this.lastUserId, name, email);
        this.users.push(newUser);
        return newUser;
    }
    getAllUsers() {
        return this.users;
    }
    getUserById(id) {
        return this.users.find(user => user.id === id);
    }
    deleteUser(id) {
        this.users = this.users.filter(user => user.id !== id);
    }
}
class TaskService {
    constructor(userService) {
        this.userService = userService;
        this.tasks = [];
        this.lastTaskId = 0;
    }
    createTask(title, description) {
        const newTask = new Task(++this.lastTaskId, title, description);
        this.tasks.push(newTask);
        return newTask;
    }
    getAllTasks() {
        return this.tasks;
    }
    assignTask(taskId, userId) {
        const task = this.tasks.find(t => t.id === taskId);
        const user = this.userService.getUserById(userId);
        if (task && user) {
            task.assignedTo = userId;
            return true;
        }
        return false;
    }
    unassignTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task)
            return false;
        task.assignedTo = undefined;
        return true;
    }
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }
}
const userService = new UserService();
const taskService = new TaskService(userService);
const createUserBtn = document.getElementById("createUserBtn");
const createUserNameInput = document.getElementById("createUserName");
const createUserEmailInput = document.getElementById("createUserEmail");
const deleteUserBtn = document.getElementById("deleteUserBtn");
const deleteUserIdInput = document.getElementById("deleteUserId");
const assignTaskBtn = document.getElementById("assignTaskBtn");
const assignTaskIdInput = document.getElementById("assignTaskId");
const assignUserIdInput = document.getElementById("assignUserId");
const createTaskBtn = document.getElementById("createTaskBtn");
const createTaskTitleInput = document.getElementById("createTaskTitle");
const createTaskDescriptionInput = document.getElementById("createTaskDescription");
const unassignTaskBtn = document.getElementById("unassignTaskBtn");
const unassignTaskIdInput = document.getElementById("unassignTaskId");
const deleteTaskBtn = document.getElementById("deleteTaskBtn");
const deleteTaskIdInput = document.getElementById("deleteTaskId");
const userListDisplay = document.querySelector(".user-manager-section .display-area");
const taskListDisplay = document.getElementById("taskList");
function displayUserList() {
    userListDisplay.innerHTML = "";
    const users = userService.getAllUsers();
    if (users.length === 0) {
        userListDisplay.innerHTML = "<p>No users found.</p>";
        return;
    }
    const ul = document.createElement("ul");
    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = `ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`;
        ul.appendChild(li);
    });
    userListDisplay.appendChild(ul);
}
function displayTaskList() {
    taskListDisplay.innerHTML = "";
    const tasks = taskService.getAllTasks();
    if (tasks.length === 0) {
        taskListDisplay.innerHTML = "<li>No tasks found.</li>";
        return;
    }
    tasks.forEach(task => {
        var _a;
        const li = document.createElement("li");
        li.textContent = `ID: ${task.id}, Title: ${task.title}, Description: ${task.description}, Assigned To: ${(_a = task.assignedTo) !== null && _a !== void 0 ? _a : "None"}`;
        taskListDisplay.appendChild(li);
    });
}
createUserBtn.addEventListener("click", () => {
    const name = createUserNameInput.value.trim();
    const email = createUserEmailInput.value.trim();
    if (name && email) {
        userService.createUser(name, email);
        createUserNameInput.value = "";
        createUserEmailInput.value = "";
        displayUserList();
    }
});
deleteUserBtn.addEventListener("click", () => {
    const id = parseInt(deleteUserIdInput.value);
    if (!isNaN(id)) {
        userService.deleteUser(id);
        deleteUserIdInput.value = "";
        displayUserList();
        displayTaskList();
    }
});
assignTaskBtn.addEventListener("click", () => {
    const taskId = parseInt(assignTaskIdInput.value);
    const userId = parseInt(assignUserIdInput.value);
    if (!isNaN(taskId) && !isNaN(userId)) {
        taskService.assignTask(taskId, userId);
        displayTaskList();
    }
});
createTaskBtn.addEventListener("click", () => {
    const title = createTaskTitleInput.value.trim();
    const description = createTaskDescriptionInput.value.trim();
    if (title && description) {
        taskService.createTask(title, description);
        createTaskTitleInput.value = "";
        createTaskDescriptionInput.value = "";
        displayTaskList();
    }
});
unassignTaskBtn.addEventListener("click", () => {
    const taskId = parseInt(unassignTaskIdInput.value);
    if (!isNaN(taskId)) {
        taskService.unassignTask(taskId);
        displayTaskList();
    }
});
deleteTaskBtn.addEventListener("click", () => {
    const id = parseInt(deleteTaskIdInput.value);
    if (!isNaN(id)) {
        taskService.deleteTask(id);
        deleteTaskIdInput.value = "";
        displayTaskList();
    }
});
displayUserList();
displayTaskList();
