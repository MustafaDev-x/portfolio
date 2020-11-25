/* -----------------------------------------
  Have focus outline only for keyboard users 
 ---------------------------------------- */

const handleFirstTab = (e) => {
  if(e.key === 'Tab') {
    document.body.classList.add('user-is-tabbing')

    window.removeEventListener('keydown', handleFirstTab)
    window.addEventListener('mousedown', handleMouseDownOnce)
  }

}

const handleMouseDownOnce = () => {
  document.body.classList.remove('user-is-tabbing')

  window.removeEventListener('mousedown', handleMouseDownOnce)
  window.addEventListener('keydown', handleFirstTab)
}

window.addEventListener('keydown', handleFirstTab)

const backToTopButton = document.querySelector(".back-to-top");
let isBackToTopRendered = false;

let alterStyles = (isBackToTopRendered) => {
  backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
  backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
  backToTopButton.style.transform = isBackToTopRendered
    ? "scale(1)"
    : "scale(0)";
};

window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    isBackToTopRendered = true;
    alterStyles(isBackToTopRendered);
  } else {
    isBackToTopRendered = false;
    alterStyles(isBackToTopRendered);
  }
});



// cruser



// set the starting position of the cursor outside of the screen
let clientX = 100;
let clientY = 100;
const innerCursor = document.querySelector(".cursor--small");

const initCursor = () => {
  // add listener to track the current mouse position
  document.addEventListener("mousemove", e => {
    clientX = e.clientX;
    clientY = e.clientY;
  });
  
  // transform the innerCursor to the current mouse position
  // use requestAnimationFrame() for smooth performance
  const render = () => {
    innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
    // if you are already using TweenMax in your project, you might as well
    // use TweenMax.set() instead
    // TweenMax.set(innerCursor, {
    //   x: clientX,
    //   y: clientY
    // });
    
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};

initCursor();

let lastX = 0;
let lastY = 0;
let isStuck = false;
let showCursor = false;
let group, stuckX, stuckY, fillOuterCursor;

const initCanvas = () => {
  const canvas = document.querySelector(".cursor--canvas");
  const shapeBounds = {
    width: 75,
    height: 75
  };
  paper.setup(canvas);
  const strokeColor = "rgba(0, 0, 0, 0.3)";
  const strokeWidth = 1;
  const segments = 8;
  const radius = 20;
  
  // we'll need these later for the noisy circle
  const noiseScale = 150; // speed
  const noiseRange = 4; // range of distortion
  let isNoisy = false; // state
  
  // the base shape for the noisy circle
  const polygon = new paper.Path.RegularPolygon(
    new paper.Point(0, 0),
    segments,
    radius
  );
  polygon.strokeColor = strokeColor;
  polygon.strokeWidth = strokeWidth;
  polygon.smooth();
  group = new paper.Group([polygon]);
  group.applyMatrix = false;
  
  const noiseObjects = polygon.segments.map(() => new SimplexNoise());
  let bigCoordinates = [];
  
  // function for linear interpolation of values
  const lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
  };
  
  // function to map a value from one range to another range
  const map = (value, in_min, in_max, out_min, out_max) => {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };
  
  // the draw loop of Paper.js 
  // (60fps with requestAnimationFrame under the hood)
  paper.view.onFrame = event => {
    // using linear interpolation, the circle will move 0.2 (20%)
    // of the distance between its current position and the mouse
    // coordinates per Frame
    lastX = lerp(lastX, clientX, 0.2);
    lastY = lerp(lastY, clientY, 0.2);
    group.position = new paper.Point(lastX, lastY);
  }
}

initCanvas();


// pointer



// canves

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var shapes = [];
var num = 50;

var staticXpos;
var staticYpos;

var opt = {
  shapecolor: "#fff",
  radius: 2,
  distance: 80,
  circleopacity: 1,
  speed: .5
};

var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;
addEventListener('resize', function() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});
//helper functions
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function clearcanvas() {
  ctx.clearRect(0, 0, w, h);
}

function getCords(e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function createShapes(Xpos, Ypos) {
  this.x = Xpos ? Xpos : random(0, w);
  this.y = Ypos ? Ypos : random(0, h);
  this.speed = opt.speed;
  this.vx = Math.cos(random(0, 360)) * this.speed;
  this.vy = Math.sin(random(0, 360)) * this.speed;
  this.r = opt.radius;
  this.color = opt.shapecolor;
  this.opacity = opt.circleopacity;
  this.draw = function() {
    ctx.beginPath();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = this.opacity;
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();

  };
  this.move = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x >= w || this.x <= 0) {
      this.vx *= -1;
    }
    if (this.y >= h || this.y <= 0) {
      this.vy *= -1;
    }
    this.x > w ? this.x = w : this.x;
    this.y > h ? this.y = h : this.y;
    this.x < 0 ? this.x = 0 : this.x;
    this.y < 0 ? this.y = 0 : this.y;
  };
}

function check(point1, rest) {
  for (var j = 0; j < rest.length; j++) {
    var yd = point1.y - rest[j].y;
    var xd = point1.x - rest[j].x;
    var d = Math.sqrt(xd * xd + yd * yd);
    if (d < opt.distance) {
      ctx.beginPath();
      ctx.globalAlpha = (1 - (d / opt.distance));
      ctx.globalCompositeOperation = 'destination-over';
      ctx.lineWidth = 1;
      ctx.moveTo(point1.x, point1.y);
      ctx.lineTo(rest[j].x, rest[j].y);
      ctx.strokeStyle = opt.shapecolor;
      ctx.lineCap = "round";
      ctx.closePath();
      ctx.stroke();
    }
  }
}

function loop() {
  clearcanvas();
  shapes[0].x = staticXpos;
  shapes[0].y = staticYpos;
  shapes[0].move();
  shapes[0].draw();
  for (var i = 1; i < shapes.length; i++) {
    shapes[i].move();
    shapes[i].draw();
    check(shapes[i], shapes);
  }
  window.requestAnimationFrame(loop);
}

function init() {
  for (var i = 0; i < num; i++) {
    shapes.push(new createShapes());
  }
  window.requestAnimationFrame(loop);
}

//events
canvas.addEventListener('mousemove', function(e) {
  var pos = getCords(e);
  staticXpos = pos.x;
  staticYpos = pos.y;
});
canvas.addEventListener('click', function(e) {
  var pos = getCords(e);
  shapes.push(new createShapes(pos.x, pos.y));
});
canvas.addEventListener("contextmenu", function(e) {
  e.preventDefault();
  shapes.splice(shapes.length - 1, 1);
});

init();
