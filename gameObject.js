import { Page } from "./page.js";
import { piecesCreate } from "./pieces.js";
import { piecesLogicCreate } from "./gamePieciesLogic.js";

var audio = new Audio("block-fall.flac");

// game manager object and logic
export var GM = {
    
    timeCurrent: 0, // for current speed
    timeEvent: 0,
    tickRate: 0,
    isAlive: 0,
    level: 0,
    piecesRemaining: 0,
  
    // score count and current piece score modifiers
    scoreHigh: 0,
    scoreCurrent: 0,
    scoreBonus: 0,
    difficultFlag: 0,
    staticUnits: [],
  
    // Set up intial game var values
    Initialize: function () {
      this.piece.Next = this.piece.currentPiece = this.piece.projectedY = 0;
  
      for (var i = 0; i < 10; i++) {
        this.staticUnits[i] = [];
        for (var j = 0; j < 20; j++) {
          this.staticUnits[i][j] = 0;
        }
      }
  
      this.timeCurrent = this.timeEvent = 0;
      this.tickRate = 500;

      this.piecesRemaining = 10;
      this.level = 1;

      this.scoreCurrent = 0;
      this.isAlive = true;

      let maxScore = 0;
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        let x = Number(value);
            if (x > maxScore) {
                maxScore = value;
            }
        }
        this.scoreHigh = maxScore;
    },
  
    // updates time each frame and executing logic if a tick has passed
    Update: function () {
      this.timeCurrent = new Date().getTime();
  
      if (this.timeCurrent >= this.timeEvent) {
        if (GM.piece.currentPiece === 0 && this.isAlive) {
          this.piece.Generate();
        } else {
          this.piece.DoGravity();
          this.piece.projectedY = this.piece.TryProject();
          Page.Game.IsDirty = true;
        }
  
        this.RefreshTimer();
      }
    },
  
    // reset the tick timer
    RefreshTimer: function () {
      this.timeEvent = new Date().getTime() + this.tickRate;
    },
  
    // called when a piece is spawned, advances level if needed
    PieceSpawned: function () {
      this.piecesRemaining--;
      if (this.piecesRemaining <= 0) {
        this.Advancelevel();
      }
    },
  
    // advance level: recalculate tickRate, reset pieces remaining
    Advancelevel: function () {
      this.level++;
  
      this.tickRate = Math.floor(555 * Math.exp(this.level / -10));
      this.piecesRemaining = Math.floor(5000 / this.tickRate);
  
      Page.ScoreBarCur.IsDirty = true;
    },
  
    // check specified rows to see if any can be cleared
    CheckUnits: function (checkRowsRaw) {
        var scoreMult = 0;
        var pieceScore = 0;
        var checkRows = [];
  
      if (this.scoreBonus > 0) {
        pieceScore += this.scoreBonus;
      }
  
      for (var a = 0; a < 20; a++) {
        if (checkRowsRaw.indexOf(a) >= 0) {
          checkRows.push(a);
        }
      }
  
      for (var i = 0; i < checkRows.length; i++) {
        var hasGap = false,
          checkIndex = checkRows[i];
  
        for (var j = 0; j < GM.staticUnits.length; j++) {
          if (GM.staticUnits[j][checkIndex] === 0) {
            hasGap = true;
            break;
          }
        }
  
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
      }
  
      if (this.difficultFlag === 1) {
        pieceScore = Math.floor(pieceScore * 1.5);
        this.difficultFlag = 0;
      }
  
      if (pieceScore > 0) {

        this.scoreCurrent += pieceScore;
        Page.ScoreBarCur.IsDirty = true;
  
        this.scoreBonus = 0;
  
        if (scoreMult > 3) {
          this.difficultFlag = 1;
        }
      }
    },
  
    GameOver: function () {
      Page.Game.IsDirty = Page.ScoreBarCur.IsDirty = true;

      if (this.scoreCurrent > this.scoreHigh) {
        this.scoreHigh = this.scoreCurrent;
        Page.ScoreBarHigh.IsDirty = true;
        let player = prompt("GameOver! Enter your name", "Player Name");

        //validate user input 
        if (player.match(/^[a-zA-Z]+$/)){
            window.localStorage.setItem(player, this.scoreHigh);
            
        }else{
            alert("Invalid name, please enter a valid name");
            let player = prompt("GameOver! Enter your name", "Player Name");
            window.localStorage.setItem(player, this.scoreHigh);
        }

        console.log(this.scoreHigh);
      }
  
      this.isAlive = false;
    }
  };

  piecesLogicCreate();

  GM.pieceObj = function (color, rotCount, units) {
    this.x = 5;
    this.y = 0;
    this.color = color;
    this.UO = {};
  
    // rotate this piece by advancing to next unit obj of linked list
    this.Rotate = function () {
      this.UO = this.UO.nextUO;
    };
  
    // set up the piece unit object linked list to define rotations
    this.SetUO = function (rotCount, units) {
      var linkedListUO = [];
  
      linkedListUO[0] = { nextUO: 0, arr: [] };
      linkedListUO[0].arr = units;
  
      for (var i = 0; i < rotCount; i++) {
        var nextI = i + 1 < rotCount ? i + 1 : 0;
        linkedListUO[i] = { nextUO: 0, arr: [] };
  
        if (i > 0) {
          linkedListUO[i - 1].nextUO = linkedListUO[i];
        }
  
        for (var j = 0; j < units.length; j++) {
          var unX, unY;
  
          if (i === 0) {
            unX = units[j].x;
            unY = units[j].y;
          } else {
            unX = linkedListUO[i - 1].arr[j].y * -1;
            unY = linkedListUO[i - 1].arr[j].x;
          }
  
          linkedListUO[i].arr[j] = { x: unX, y: unY };
        }
      }
  
      linkedListUO[rotCount - 1].nextUO = linkedListUO[0];
      this.UO = linkedListUO[0];
    };
    this.SetUO(rotCount, units);
  };

  piecesCreate();

  piecesLogicCreate();
