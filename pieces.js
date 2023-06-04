import { GM } from './gameObject.js';
import { Page } from './page.js';
//matrix representation from https://medium.com/@paulosales_17259/designing-and-creating-the-tetris-game-in-typescript-9ab6ee7e5cf1
// and color same from this topic 

export function getRandomFigures(index){
    return [GM.O(), GM.I(), GM.S(), GM.Z(), GM.L(), GM.J(), GM.T()][index];
}

// function for creating pieces
export function piecesCreate (){
    
    GM.O = function(){
        return new GM.pieceObj('rgb(255,256,56)', 1,                
                            [{x:-1,y: 0},
                             {x: 0,y: 0},
                             {x:-1,y: 1}, 
                             {x: 0,y: 1}]);
      };
      
      GM.I = function(){
        return new GM.pieceObj('rgb(56,118,254)', 2,  
                            [{x:-2,y: 0},
                             {x:-1,y: 0},
                             {x: 0,y: 0},
                             {x: 1,y: 0}]);
      };
      
      GM.S = function(){ 
        return new GM.pieceObj('rgb(245,56,254)', 2, 
                            [{x: 0,y: 0},
                             {x: 1,y: 0}, 
                             {x:-1,y: 1},
                             {x: 0,y: 1}]);
      };
      
      GM.Z = function(){ 
        return new GM.pieceObj('rgb(255,142,11)', 2,
                            [{x:-1,y: 0},
                             {x: 0,y: 0},
                             {x: 0,y: 1},
                             {x: 1,y: 1}]);
      };
      
      GM.L = function(){
        return new GM.pieceObj('rgb(13,255,114)', 4,
                            [{x:-1,y: 0},
                             {x: 0,y: 0},
                             {x: 1,y: 0},
                             {x:-1,y:-1}]);
      };
      
      GM.J = function(){
        return new GM.pieceObj('rgb(13,194,255)', 4,
                            [{x:-1,y: 0},
                             {x: 0,y: 0},
                             {x: 1,y: 0},
                             {x: 1,y:-1}]);
      };
      
      GM.T = function(){
        return new GM.pieceObj('rgb(255,13,155)', 4,
                            [{x:-1,y: 0},
                             {x: 0,y: 0},
                             {x: 1,y: 0},
                             {x: 0,y:-1}]);
      };
}

export function drawUpcomingPiece(drawArea, pc) {
    var uDrawSize = Math.floor(Page.unitSize / 2);

    // next box background
    Page.ctx.fillStyle = "rgb(28,30,34)";
    Page.ctx.fillRect(drawArea.left, drawArea.top, drawArea.W, drawArea.H);
  
    if (pc !== 0) {
      Page.ctx.fillStyle = pc.color;
  
      var totalL = 0,
        totalT = 0,
        countedL = [],
        countedT = [];
  
      // calculate average positions of units in order to center
      for (var i = 0; i < pc.UO.arr.length; i++) {
        var curX = pc.UO.arr[i].x,
          curY = pc.UO.arr[i].y;
  
        if (countedL.indexOf(curX) < 0) {
          countedL.push(curX);
          totalL += curX;
        }
        if (countedT.indexOf(curY) < 0) {
          countedT.push(curY);
          totalT += curY;
        }
      }
  
      var avgL = uDrawSize * (totalL / countedL.length + 0.5),
        avgT = uDrawSize * (totalT / countedT.length + 0.5),
        offsetL = drawArea.left + drawArea.W / 2,
        offsetT = drawArea.top + drawArea.H / 2;
  
     // draw the piece
      for (var j = 0; j < pc.UO.arr.length; j++) {
        var drawL = Math.floor(offsetL - avgL + pc.UO.arr[j].x * uDrawSize),
          drawT = Math.floor(offsetT - avgT + pc.UO.arr[j].y * uDrawSize);
  
        Page.ctx.fillRect(drawL, drawT, uDrawSize - 1, uDrawSize - 1);
      }
    }
  }

