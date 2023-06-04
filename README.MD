<h1 align="Center">Tetris JavaScript</h1>

## Project goal 

The goal of the project is to learn the JavaScript programming language and write a Tetris game 

## Progress
The design had to be decided first. The next step was to create the field and the shapes. Then the further logic of the game itself. The final part was to add various features, such as saving game results, sound, start page.

## Description of functionality

 - __Validation__ of user input and __localStorage__ can be found in the gameObject.js in the GameOver function.

    ```js 
    let player = prompt("GameOver! Enter your name","Player Name");

        //validate user input 
        if (player.match(/^[a-zA-Z]+$/)){
            window.localStorage.setItem(player, this.scoreHigh);
            
        }else{
            alert("Invalid name, please enter a valid name");
            let player = prompt("GameOver! Enter your name", "Player Name");
            window.localStorage.setItem(player, this.scoreHigh);
        }
    ```

 - The use of __Canvas__ can be found in page.js at the very beginning of the file 

    ```js 
    
    export var Page = {
        body: document.getElementsByTagName("body")[0],
        cvs: document.createElement("canvas"),
        ...
    ```
 - The use of the __audio__ file can be found in the GameObject.js in the CheckUnits function

    ```js

    if (hasGap === false) {
            for (var k = 0; k < GM.staticUnits.length; k++) {
                GM.staticUnits[k].splice(checkIndex, 1);
                GM.staticUnits[k].unshift(0);
            }
    
            pieceScore += 100 + 200 * scoreMult;
            audio.play();
            
            if (scoreMult > 2) 
                pieceScore += 100;
            
            scoreMult++;
            }
    ```

## Comments 
 No comments

