import { GM } from "./gameObject.js";
import { DrawText, ColorWithAlpha } from "./gameHelper.js";
import { drawUpcomingPiece } from "./pieces.js";

// Page object and logic 

export var Page = {
    body: document.getElementsByTagName("body")[0],
    cvs: document.createElement("canvas"),
    ctx: 0,

    unitSize: 0,
    AreaArr: [],

    // Adapted cnvas to the window size on based window size
    WindowChanged: function () {
        var bodyW = document.documentElement.clientWidth;
        var bodyH = document.documentElement.clientHeight;
        var newUnitW = (bodyW - (bodyW % 80)) / 16;
        var newUnitH = (bodyH - (bodyH % 100)) / 20;
        var newUnitMin = Math.max(Math.min(newUnitW, newUnitH), 20);

        this.unitSize = newUnitMin;

        var rightLimit = 0, bottomLimit = 0;

        for (var i = 0; i < Page.AreaArr.length; i++) {
            Page.AreaArr[i].CalculateBounds();

            var newRightLimit = Page.AreaArr[i].left + Page.AreaArr[i].W;
            var newBottomLimit = Page.AreaArr[i].top + Page.AreaArr[i].H;

            rightLimit = Math.max(newRightLimit, rightLimit);
            bottomLimit = Math.max(newBottomLimit, bottomLimit);
        }

        this.cvs.width = rightLimit;
        this.cvs.height = bottomLimit;
        this.cvs.className = "myCanvas";

        var topPos = (bodyH - bottomLimit) / 2;
        var leftPos = bodyW / 2 - this.Game.W / 2;
        var rightOffset = bodyW - (leftPos + rightLimit) - this.unitSize * 0.5;

        if (rightOffset < 0) 
            leftPos = Math.max(this.unitSize * 0.5, leftPos + rightOffset);

        this.cvs.style.left = leftPos + "px";
        this.cvs.style.top = topPos + "px";
    },

    // performs the page setup
    Initialize: function () {
        document.body.appendChild(Page.cvs);

        this.body.style.overflow = "hidden";
        this.body.style.backgroundColor = "rgb(19,21,25)";
        this.cvs.style.position = "absolute";
        this.ctx = this.cvs.getContext("2d");

        this.WindowChanged();
    },

    // redraws canvas visuals
    Update: function () {
        for (var i = 0; i < Page.AreaArr.length; i++) {
            if (Page.AreaArr[i].IsDirty) {
                Page.AreaArr[i].Draw();
                Page.AreaArr[i].IsDirty = false;
            }
        }
    },
};

// Definition for Area objects
class DrawAreaObj {
    constructor(Left, Top, Width, Height, DrawFunction) {
        // bounds in UNITS
        this.leftBase = Left;
        this.topBase = Top;
        this.widthBase = Width;
        this.heightBase = Height;

        // bounds in PIXELS
        this.left = 0;
        this.top = 0;
        this.W = 0;
        this.H = 0;

        this.IsDirty = false;

        // bounds recalculated
        this.CalculateBounds = function () {
            this.left = this.leftBase * Page.unitSize;
            this.top = this.topBase * Page.unitSize;
            this.W = this.widthBase * Page.unitSize;
            this.H = this.heightBase * Page.unitSize;

            this.IsDirty = true;
        };

        this.Draw = DrawFunction;
        Page.AreaArr.push(this);
    }
}

Page.Game = new DrawAreaObj(0, 0, 10, 20, function () {
    // unitSize minus a couple pixels of separation
    var uDrawSize = Page.unitSize - 2, drawL, drawT;

    Page.ctx.fillStyle = "rgb(28,30,34)";
    Page.ctx.fillRect(this.left, this.top, this.W, this.H);

    // draw the static unit blocks
    for (var i = 0; i < GM.staticUnits.length; i++) {
        for (var j = 0; j < GM.staticUnits[i].length; j++) {
            var uValue = GM.staticUnits[i][j];

            // if this unit value is not 0, draw the unit
            if (uValue !== 0) {
                drawL = i * Page.unitSize + 1;
                drawT = j * Page.unitSize + 1;

                Page.ctx.fillStyle = GM.isAlive ? uValue : "rgb(34,36,42)";
                Page.ctx.fillRect(drawL, drawT, uDrawSize, uDrawSize);
            }
        }
    }

    // draw the current projection and piece
    if (GM.piece.currentPiece !== 0 && GM.isAlive) {
        var projColor = ColorWithAlpha(GM.piece.currentPiece.color, 0.1);

        for (var k = 0; k < GM.piece.currentPiece.UO.arr.length; k++) {
            drawL = (GM.piece.currentPiece.x + GM.piece.currentPiece.UO.arr[k].x) * Page.unitSize + 1;
            drawT = (GM.piece.currentPiece.y + GM.piece.currentPiece.UO.arr[k].y) * Page.unitSize + 1;

            Page.ctx.fillStyle = GM.piece.currentPiece.color;
            Page.ctx.fillRect(drawL, drawT, uDrawSize, uDrawSize);

            // draw the projection
            if (GM.isAlive && GM.piece.projectedY !== 0) {
                drawT += GM.piece.projectedY * Page.unitSize;

                Page.ctx.fillStyle = projColor;
                Page.ctx.fillRect(drawL, drawT, uDrawSize, uDrawSize);
            }
        }
    }

    // if the player is dead, draw the game over text
    if (!GM.isAlive)
        DrawText( "GAME OVER", "rgb(255,255,255)", "500", "center", uDrawSize, this.W / 2, this.H / 4 );
});

// draw the upcoming pieces

Page.UpcomingA = new DrawAreaObj(10.5, 2.6, 2.5, 2.5, function () {
    drawUpcomingPiece(this, GM.piece.Upcoming[0]);
});

Page.UpcomingB = new DrawAreaObj(10.5, 5.2, 2.5, 2.5, function () {
    drawUpcomingPiece(this, GM.piece.Upcoming[1]);
});

Page.UpcomingC = new DrawAreaObj(10.5, 7.8, 2.5, 2.5, function () {
    drawUpcomingPiece(this, GM.piece.Upcoming[2]);
});

// draw score in page
function drawScoreBar(drawArea, score, color, fontWeight, textAlign) {
    // draw the score area back bar
    Page.ctx.fillStyle = "rgb(28,30,34)";
    Page.ctx.fillRect(drawArea.left, drawArea.top, drawArea.W, drawArea.H);

    // draw the player's score
    var text = ("00000000" + score).slice(-7);
    var left = drawArea.left + drawArea.W - 4;
    var top = drawArea.top + Page.unitSize * 0.8;
    var size = Math.floor(Page.unitSize * 0.8) + 0.5;

    DrawText(text, color, fontWeight, textAlign, size, left, top);
}

Page.ScoreBarHigh = new DrawAreaObj(10.5, 0, 4.5, 1, function () {
    drawScoreBar(this, GM.scoreHigh, "rgb(255,232,96)", "500", "right");
});

Page.ScoreBarCur = new DrawAreaObj(10.5, 1.1, 4.5, 1, function () {
    drawScoreBar(this, GM.scoreCurrent, "rgb(255,255,255)", "500", "right");
});
