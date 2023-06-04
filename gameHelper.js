import { Page } from "./page.js";

// Function for drawing text on canvas
export function DrawText(text, color, weight, alignment, size, left, top) {
    Page.ctx.font = weight + " " + size + 'px "Jura"';
    Page.ctx.textAlign = alignment;
    Page.ctx.fillStyle = color;
    Page.ctx.fillText(text, left, top);
  }
  
// Applies transparent color
export function ColorWithAlpha(color, alpha) {
    var retColor = "rgba" + color.substring(3, color.length - 1);
    retColor += "," + alpha + ")";
    return retColor;
  }