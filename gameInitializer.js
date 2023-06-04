import {Page} from "./page.js";
import {GM} from "./gameObject.js";

var gameLoopID;

// Game initialization
export function Init() {

    Page.Initialize();
  

    GM.Initialize();
}
  
// Main game loop
  export function Loop() {

    Page.Update();
  

    if (GM.isAlive) {
      GM.Update();
    }
  
    gameLoopID = window.requestAnimationFrame(Loop);

  }

  export function pauseGame() {
    cancelAnimationFrame(gameLoopID);
  }

  export function resumeGame() {
    gameLoopID = requestAnimationFrame(Loop);
    
  }