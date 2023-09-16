import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs/promises";

import { existsSync } from "fs";

const hello = (Program) => {
  Program.command("welcome <username>")
    .description("'Display a welcome message with a customized username'")
    .action((username) => {
      figlet(`welcome  ${username}`, "Standard", (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        const dataColoring = chalk.yellow.bgWhite(data);
        console.log(dataColoring);
      });
    });
};

const Task = (Program) => {
  Program.command("manage-task ")
    .description("help people to manage tasks")
    .action(async () => {
      // Read existing tasks from a JSON file (if it exists)
      mainMenu();
    });
};

const mainMenu = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Task Manager CLI",
        choices: ["Add a task", "List tasks", "Delete tasks", "Search", "Exit"],
      },
    ])
    .then(async (answers) => {
      switch (answers.action) {
        case "Add a task":
          addTask();
          break;
        case "List tasks":
          listTasks();
          break;
        case "Delete tasks":
          deleteTask();
          break;
        case "Search":
          searchUsername();
          break;
        case "Exit":
          console.log("good bye");
          break;
      }
    });
};

const addTask = async () => {
  let { username, task } = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Enter Username :",
    },
    {
      type: "input",
      name: "task",
      message: "Enter the task:",
    },
  ]);
  task = task?.trim();
  if (task && username) {
    const data = await readTasks();
    const newData = { username, task: [task] };
    if (data.length === 0) {
      await writeTasks(newData);
    } else {
      let exist = -1;
      const userIndex = data.map((element, index) => {
        if (username === element.username) {
          exist = index;
        }
      });
      if (exist !== -1) {
        data[exist].task.push(task);
      } else {
        data.push(newData);
      }
      await writeTasks(data);
    }
  } else {
    console.error("can not be empty");
  }
  mainMenu();
};

const readTasks = async () => {
  try {
    const data = await fs.readFile("tasks.json", "utf-8");

    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      // Handle the case when the file doesn't exist
      console.log('The "tasks.json" file does not exist.');
      return [];
    } else {
      // Handle other errors
      throw error;
    }
  }
};

const listTasks = async () => {
  const userInput = await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Enter the username",
    },
  ]);

  const username = userInput.username; // Access the 'username' property
  const data = await readTasks();
  const user = data.find((element) => element.username === username);

  if (user) {
    const tasks = user.task;
    if (tasks.length > 0) {
      console.log(`Tasks for ${username}:`);
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task}`);
      });
    } else {
      console.log(`No tasks found for ${username}`);
    }
  } else {
    console.log(username.username);
    console.log(`User ${username} not found`);
  }
};

const deleteTask = async () => {
  try {
    const data = await readTasks(); // Read tasks asynchronously

    if (data.length === 0) {
      console.log("No tasks to delete.");
      mainMenu();
      return;
    }
    const { username } = await inquirer.prompt([
      {
        type: "input",
        name: "username",
        message: "Enter Username :",
      },
    ]);
    const userIndex = data.findIndex(
      (element) => element.username === username
    );
    if (userIndex === -1) {
      console.log(`${username} can't be found.`);
      mainMenu();
      return;
    } else {
      const tasks = data[userIndex].task;
      if (tasks.length === 0) {
        console.log("No tasks to delete.");
        mainMenu();
        return;
      } else {
        const { choice } = await inquirer.prompt([
          {
            type: "list",
            name: "choice",
            message: "Select a task to delete:",
            choices: [
              ...tasks.map((task, index) => ({
                name: `${index + 1}. ${task}`,
                value: index,
              })),
              {
                name: ` . Exit`,
                value: tasks.length,
              },
            ],
          },
        ]);
        const deletedTask = await tasks.splice(choice, 1);
        data[userIndex].task = tasks;
        await writeTasks(data);
        console.log(
          `${
            deletedTask == "" ? "Nothing" : `Task ${deletedTask}`
          } has been deleted.`
        );
        mainMenu();
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const searchUsername = async () => {
  try {
    const { username } = await inquirer.prompt([
      {
        type: "input",
        name: "username",
        message: "Enter desired username :",
      },
    ]);
    const data = await fs.readFile("languages.json", { encoding: "utf-8" });
    const parsedData = JSON.parse(data);
    const usersArray = Object.values(parsedData);
    const filteredUsers = usersArray.filter(
      (element) => element.username === username
    );

    if (filteredUsers.length === 0) {
      console.log("No user has been found.");
    } else {
      console.table(filteredUsers);
    }

    mainMenu();
  } catch (err) {
    console.error("Error:", err);
    mainMenu();
  }
};

const writeTasks = async (tasks) => {
  if (existsSync("tasks.json")) {
    await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
  } else {
    await fs.writeFile("tasks.json", `[${JSON.stringify(tasks, null, 2)}]`);
  }
};

export { hello, Task };
