// import chalk from 'chalk'
// import chalkAnimation from 'chalk-animation'
// import figlet from 'figlet'
// import gradient from 'gradient-string';

import {hello,hi} from "./hello.js"
import {Command} from 'commander'
import inquirer from 'inquirer';
import chalk from 'chalk'
import chalkAnimation from 'chalk-animation'
const Program = new Command()


Program
.name("Interactive-Game")
.description("Interactive-Game Help people to learn many things about backend")
.version("1.0.0")


Program.command('add')
.description('Add a new question')
.alias('a')
  .action((str)=>{
    

inquirer
  .prompt([
    {
      type:'list',
      name:"favorite",
      message:"what is your favorite language",
      choices:['js',"ruby","java"]
    },{
      type:'checkbox',
      name:"hated",
      message:"what is your hated language",
      choices:['js',"ruby","java","php","python"]
    }
  ])
  .then((answers) => {
    console.log(chalk.white.bgRed("The Favorite language is", answers.favorite))
    const hatedLanguage = chalkAnimation.rainbow(`The hated language is ${answers.hated}`,3)

    setInterval(() => {
        hatedLanguage.start();
       setTimeout(()=>{
             hatedLanguage.stop()
  },1000);
      }, 2000)

  })
  
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else  {
      // Something else went wrong
    }
  });
  })

Program.parse()
// hello()


// const sleep = (ms=8000)=>
//   new Promise((r)=> setTimeout(r, ms))


// async function welcome(){
//   const rainbowTitle = chalkAnimation.rainbow('This is A Really Good Team')


// await sleep()
// console.log("hi")

// rainbowTitle.stop()

// }

// async function winner(){
//   figlet('Congratulations ! You',(err,data)=>{
//     if(err) return console.error(err)
//     console.clear()
//     console.log(gradient.pastel.multiline(data))
//   })

// }

// await welcome()
// winner()
