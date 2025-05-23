interface IUser {
  id: number;
  name: string;
  email: string;
}

interface ITask {
  id: number;
  title: string;
  description: string;
  assignedTo?: number;
}

class User implements IUser {
  constructor(public id: number, public name: string, public email: string) {}
}

class Task implements ITask {
  constructor(
    public id: number,
    public title: string,
    public description: string,
    public assignedTo?: number
  ) {}
}

class UserService {
  private users: User[] = [];
  private lastUserId = 0;

  createUser(name: string, email: string): User {
    const newUser = new User(++this.lastUserId, name, email);
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
  }
}

class TaskService {
  private tasks: Task[] = [];
  private lastTaskId = 0;

  constructor(private userService: UserService) {}

  createTask(title: string, description: string): Task {
    const newTask = new Task(++this.lastTaskId, title, description);
    this.tasks.push(newTask);
    return newTask;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  assignTask(taskId: number, userId: number): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    const user = this.userService.getUserById(userId);
    if (task && user) {
      task.assignedTo = userId;
      return true;
    }
    return false;
  }

  unassignTask(taskId: number): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return false;
    task.assignedTo = undefined;
    return true;
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}

const userService = new UserService();
const taskService = new TaskService(userService);

const createUserBtn = document.getElementById("createUserBtn") as HTMLButtonElement;
const createUserNameInput = document.getElementById("createUserName") as HTMLInputElement;
const createUserEmailInput = document.getElementById("createUserEmail") as HTMLInputElement;
const deleteUserBtn = document.getElementById("deleteUserBtn") as HTMLButtonElement;
const deleteUserIdInput = document.getElementById("deleteUserId") as HTMLInputElement;
const assignTaskBtn = document.getElementById("assignTaskBtn") as HTMLButtonElement;
const assignTaskIdInput = document.getElementById("assignTaskId") as HTMLInputElement;
const assignUserIdInput = document.getElementById("assignUserId") as HTMLInputElement;

const createTaskBtn = document.getElementById("createTaskBtn") as HTMLButtonElement;
const createTaskTitleInput = document.getElementById("createTaskTitle") as HTMLInputElement;
const createTaskDescriptionInput = document.getElementById("createTaskDescription") as HTMLInputElement;
const unassignTaskBtn = document.getElementById("unassignTaskBtn") as HTMLButtonElement;
const unassignTaskIdInput = document.getElementById("unassignTaskId") as HTMLInputElement;
const deleteTaskBtn = document.getElementById("deleteTaskBtn") as HTMLButtonElement;
const deleteTaskIdInput = document.getElementById("deleteTaskId") as HTMLInputElement;

const userListDisplay = document.querySelector(".user-manager-section .display-area") as HTMLElement;
const taskListDisplay = document.getElementById("taskList") as HTMLElement;

function displayUserList(): void {
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

function displayTaskList(): void {
  taskListDisplay.innerHTML = "";
  const tasks = taskService.getAllTasks();
  if (tasks.length === 0) {
    taskListDisplay.innerHTML = "<li>No tasks found.</li>";
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.textContent = `ID: ${task.id}, Title: ${task.title}, Description: ${task.description}, Assigned To: ${task.assignedTo ?? "None"}`;
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
