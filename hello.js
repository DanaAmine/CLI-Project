import { Command, program } from "commander";
import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";

import fs from "fs/promises";
import fsd from "fs";

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
          listTask();
          break;
        case "Delete tasks":
          deleteTask();
          break;
        case "Search":
          searchUsername("amine");
          break;
        case "Exit":
          console.log("good bye");
          break;
      }
    });
};

const addTask = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "username",
        message: "Enter the user:",
      },
      {
        type: "input",
        name: "task",
        message: "Enter the task:",
      },
    ])
    .then(async (answers) => {
      const task = await answers.task.trim();
      const username = await answers.username.trim();
      if (task && username) {
        const data = await readTasks();
        if (data.length !== 0) {
          const dataArray = Object.values(data);
          const dataFetch = dataArray.filter(
            (element) => element.name === username
          );
          console.log(dataFetch)
          const tasks = dataFetch[0].task;
          

          console.log(tasks)
          tasks.push(task);
          const newData = { name: username, task: tasks };

          dataArray.push(newData);
          await writeTasks(newData);
          console.log(`Task "${data}" added successfully.`);
        }
      } else {
        console.error("can not be empty");
      }
      mainMenu();
    });
};

const readTasks = async () => {
  try {
    const data = await fs.readFile("./tasks.json", "utf-8");
    return JSON.parse(data);
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

const listTask = async () => {
  try {
    const tasks = await readTasks();
    if (tasks.length === 0) {
      console.log("No tasks found.");
    } else {
      console.log("Tasks:");
      tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task}`);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
  mainMenu();
};

const deleteTask = async () => {
  try {
    const tasks = await readTasks(); // Read tasks asynchronously

    if (tasks.length === 0) {
      console.log("No tasks to delete.");
      mainMenu();
      return;
    }

    inquirer
      .prompt([
        {
          type: "list",
          name: "taskIndex",
          message: "Select a task to delete:",
          choices: tasks.map((task, index) => ({
            name: `${index + 1}. ${task}`,
            value: index,
          })),
        },
      ])
      .then(async (answers) => {
        const deletedTask = tasks.splice(answers.taskIndex, 1)[0];
        await writeTasks(tasks);
        console.log(`Task "${deletedTask}" has been deleted.`);
        mainMenu();
      });
  } catch (error) {
    console.error("Error:", error);
  }
};

const searchUsername = async (username) => {
  try {
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
  if (fsd.existsSync("./tasks.json")) {
    await fs.writeFile("./tasks.json", JSON.stringify(tasks, null, 2));
  } else {
    await fs.writeFile("./tasks.json", `[${JSON.stringify(tasks, null, 2)}]`);
  }
};

export { hello, Task };
