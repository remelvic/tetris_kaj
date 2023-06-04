import { startEventListener } from "./eventListener.js";
import {Init, Loop} from "./gameInitializer.js";

// Called on page load / game reset, Init fcn initializes
// the Page and GM objects, then starts the main game loop.

// Create a welcome screen with a start button
// if start buuton is clicked, remove welcome screen and start game
function welcome(){
    let container = document.createElement("div");
    container.id = "container";
    document.body.appendChild(container);

    let helloMessage = document.createElement("div");
    helloMessage.id = "helloMessage";
    helloMessage.innerHTML = "Welcome to Tetris!";
    container.appendChild(helloMessage);
    
    let buttonStart = document.createElement("button");
    buttonStart.id = "start-button";
    buttonStart.innerHTML = "Start";
    
    container.appendChild(buttonStart);

    buttonStart.addEventListener("click", function(){
        document.body.removeChild(container);
        Init();
        Loop();
    })
    
}

startEventListener();

welcome();


