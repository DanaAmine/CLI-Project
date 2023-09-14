// import chalk from 'chalk'
// import chalkAnimation from 'chalk-animation'
// import figlet from 'figlet'
// import gradient from 'gradient-string';

import { hello, hi } from "./hello.js";
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

Program.command("add")
  .description("Add a new question")
  .alias("a")
  .action(() => {
    inquirer
      .prompt([
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
        const fav = answers.favorite;
        fs.writeFile("./languages.json", JSON.stringify(answers), (err) => {
          if (err) {
            console.error(err); // Log the error
          } else {
            console.log("Data has been written to languags.json");
          }
        });
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
      const Data = JSON.parse(data)
      console.table(Data);
    });
  });

Program.parse();
