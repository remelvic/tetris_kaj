import { Page } from "./page.js";
import { GM } from "./gameObject.js";
import { pauseGame, resumeGame } from "./gameInitializer.js";
var isPaused = false;

export function startEventListener() {
    document.addEventListener( "keydown", function (evt) {
            var key = event.keyCode || event.which;

            if (GM.isAlive) {
                if (key === 38) {
                    Page.Game.IsDirty = GM.piece.TryRotate(); // up
                  } else if (key === 37) {
                    Page.Game.IsDirty = GM.piece.TryMove(-1, 0); //left 
                  } else if (key === 39) {
                    Page.Game.IsDirty = GM.piece.TryMove(1, 0); // right
                  } else if (key === 40) {
                    Page.Game.IsDirty = GM.piece.TryMove(0, 1); // down
                  } else if (key === 32) {
                    Page.Game.IsDirty = GM.piece.TryDrop(); // spacebar
                  } else if (key === 80) {
                    // Pause
                    isPaused ? resumeGame() : pauseGame();
                    isPaused = !isPaused;
                  }

                // if board was changed -> reload piece projection on  the board 
                if (Page.Game.IsDirty) {
                    GM.piece.projectedY = GM.piece.TryProject();
                }
            } else {
                window.location.reload();
            }
        },
        false
    );

    window.onresize = function (event) {
        Page.WindowChanged();
    };
}
