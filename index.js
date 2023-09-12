import chalk from 'chalk'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import gradient from 'gradient-string';


// const sleep = (ms=8000)=>
//   new Promise((r)=> setTimeout(r, ms))


async function welcome(){
  const rainbowTitle = chalkAnimation.rainbow('This is A Really Good Team')


// await sleep()

// rainbowTitle.stop()

}

async function winner(){
  figlet('Congratulations ! You',(err,data)=>{
    if(err) return console.error(err)
    console.clear()
    console.log(gradient.pastel.multiline(data))
  })

}

await welcome()
winner()
