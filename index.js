// import chalk from 'chalk'
// import chalkAnimation from 'chalk-animation'
// import figlet from 'figlet'
// import gradient from 'gradient-string';

import { hello, Task } from "./hello.js";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import fs from "fs";
const Program = new Command();

Program.name("Interactive-Game")
  .description(
    "Interactive-Game Help people to learn many things about backend"
  )
  .version("1.0.0");
hello(Program);
Task(Program);
Program.command("add")
  .description("Add a new question")
  .alias("a")
  .action(() => {
    inquirer
      .prompt([
        {
          type: "input",
          name: "username",
          message: "What's your username?",
        },
        {
          type: "input",
          name: "person",
          message: "how are you?",
        },
        {
          type: "list",
          name: "favorite",
          message: "what is your favorite language",
          choices: ["js", "ruby", "java"],
        },
        {
          type: "checkbox",
          name: "hated",
          message: "what is your hated languages",
          choices: ["js", "ruby", "java", "php", "python"],
        },
      ])
      .then((answers) => {
        console.log(
          chalk.white.bgRed("The Favorite language is", answers.favorite)
        );
        const hatedLanguage = chalkAnimation.rainbow(
          `The hated language is ${answers.hated}`,
          3
        );

        hatedLanguage.start();
        if (fs.existsSync("languages.json")) {
          fs.readFile("languages.json", { encoding: "utf-8" }, (err, data) => {
            if (err) {
              console.error("Can't read file.");
            } else {
              let user = [];
              const parsedData = JSON.parse(data);
              if (parsedData) user = parsedData;
              user.push(answers);
              fs.writeFile("languages.json", JSON.stringify(user), (err) => {
                if (err) {
                  console.error(err); // Log the error
                } else {
                  console.log("Data has been written to languags.json");
                }
              });
            }
          });
        }else{
          fs.writeFile("languages.json", `[${JSON.stringify(answers)}]`, (err) => {
            if (err) {
              console.error(err); // Log the error
            } else {
              console.log("Data has been written to languags.json");
            }
          });
        }
      })

      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
        } else {
          // Something else went wrong
        }
      });
  });
Program.command("list")
  .description("listing a questions")
  .alias("l")
  .action(() => {
    fs.readFile("./languages.json", "utf-8", (err, data) => {
      if (err) {
        console.error("file doesn't exist");
      }
      const Data = JSON.parse(data);
      const DataArray = [Data];
      console.table(DataArray);
    });
  });

Program.parse();
