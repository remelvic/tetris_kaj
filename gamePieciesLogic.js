import { GM } from "./gameObject.js";
import { Page } from "./page.js";
import { getRandomFigures } from "./pieces.js";


// piece logic function (rotate, drop, move, etc.)
export function piecesLogicCreate() {
    GM.piece = {

        Cur: 0,
        projectedY: 0,
        // upcoming pieces
        Upcoming: [0, 0, 0],

        // push upcoming piece to current & randomize new upcoming piece
        Generate: function () {
            
            this.currentPiece = this.Upcoming[0];
            this.Upcoming[0] = this.Upcoming[1];
            this.Upcoming[1] = this.Upcoming[2];

            // check if the player lost
            if (this.currentPiece !== 0) {
                var spawnCollisions = this.CheckCollisions(0, 0, 0);
                if (spawnCollisions > 0) {
                    GM.GameOver();
                    this.Freeze();
                }
            }

            // if player is alive, generate random upcoming piece
            if (GM.isAlive !== 0) {
                var randInt = Math.floor(Math.random() * 7);
                this.Upcoming[2] = getRandomFigures(randInt);
                
                if (this.currentPiece !== 0) {
                    GM.PieceSpawned();
                    Page.Game.IsDirty = true;
                }

                Page.UpcomingA.IsDirty = Page.UpcomingB.IsDirty = Page.UpcomingC.IsDirty = true;
            }
        },

        // freeze the current piece's position and rotation
        Freeze: function () {
            if (GM.isAlive) {
                var affectedRows = [];

                for (var i = 0; i < this.currentPiece.UO.arr.length; i++) {
                    var staticX = this.currentPiece.x + this.currentPiece.UO.arr[i].x,
                        
                    staticY = this.currentPiece.y + this.currentPiece.UO.arr[i].y;

                    if (staticY >= 0 && staticY <= GM.staticUnits[0].length) {
                        GM.staticUnits[staticX][staticY] = this.currentPiece.color;
                    }

                    if (affectedRows.indexOf(staticY) < 0) {
                        affectedRows.push(staticY);
                    }
                }

                GM.CheckUnits(affectedRows);
                this.Generate();
            }
        },

        DoGravity: function () {
            if (this.currentPiece !== 0) {
                var collisions = this.CheckCollisions(0, 0, 1);

                collisions === 0 ? this.currentPiece.y++ : this.Freeze();
            }
            GM.RefreshTimer();
        },

        // check if can rotate current piece
        TryRotate: function () {
            if (this.currentPiece !== 0) {
                var collisions = this.CheckCollisions(1, 0, 0);

                if (collisions === 0) {
                    this.currentPiece.Rotate();
                    return true;
                }
            }
            return false;
        },

        // check if can move current piece
        TryMove: function (moveX, moveY) {
            if (this.currentPiece !== 0) {
                var collisions = this.CheckCollisions(0, moveX, moveY);

                if (collisions === 0) {
                    this.currentPiece.x += moveX;
                    this.currentPiece.y += moveY;

                    if (moveY > 0) {
                        GM.RefreshTimer();
                        GM.scoreBonus++;
                    }
                    return true;
                }
            }
            return false;
        },

        // check if can drop current piece
        TryDrop: function () {
            var squaresDropped = 0;

            if (this.currentPiece !== 0) {
                while (this.TryMove(0, 1) === true && squaresDropped < 22) {
                    squaresDropped++;
                }
            }

            if (squaresDropped > 0) {
                GM.scoreBonus += 2 * squaresDropped;
                this.Freeze();
                return true;
            } else {
                return false;
            }
        },

        // check if can project current piece
        TryProject: function () {
            var squaresDropped = 0;

            if (this.currentPiece !== 0) {
                while ( this.CheckCollisions(0, 0, squaresDropped) === 0 && squaresDropped < 22) {
                    squaresDropped++;
                }
            }
            return squaresDropped - 1;
        },

        // return collision count OR -1 if test piece out of bounds
        CheckCollisions: function (doRot, offsetX, offsetY) {
            var unitArr, collisionCount = 0;

            doRot === 1 ? unitArr = this.currentPiece.UO.nextUO.arr : unitArr = this.currentPiece.UO.arr;

            for (var i = 0; i < unitArr.length; i++) {
                var testX = this.currentPiece.x + unitArr[i].x + offsetX;
                var testY = this.currentPiece.y + unitArr[i].y + offsetY;
                var limitX = GM.staticUnits.length;
                var limitY = GM.staticUnits[0].length;

                if (testX < 0 || testX >= limitX || testY >= limitY) {
                    return -1;
                } else if (testY > 0) {
                    if (GM.staticUnits[testX][testY] !== 0) {
                        collisionCount++;
                    }
                }
            }
            return collisionCount;
        },
    };
}
