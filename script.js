/**  @type {HTMLCanvasElement} */      
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth-20;
canvas.height = window.innerHeight-20;

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

const FPS = 60;
const PLAYER_SIZE = 10;
const THRUST = 3;
const TURN_SPEED = 180;
const FRICTION = 0.7;
const DIV = 4

var thurstCoolDown = 0;

class Player {
   constructor() {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.dx = 0;
      this.dy = 0;
      this.thrust = false;
      this.a = 90 / 180 * Math.PI;
      this.r = 25;
      this.rot = 0;
   }

   // Desenha o player na tela
   draw() {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Linha esquerda
      ctx.moveTo(
         player.x + 4/3 * player.r * Math.cos(player.a),
         player.y - 4/3 * player.r * Math.sin(player.a)
      );
      ctx.lineTo(
         player.x - player.r * (2/3 * Math.cos(player.a) + Math.sin(player.a)),
         player.y + player.r * (2/3 * Math.sin(player.a) - Math.cos(player.a))
      );

      // Arco inferior
      ctx.lineTo(
         player.x, player.y
      );
      ctx.lineTo(
         player.x - player.r * (2/3 * Math.cos(player.a) - Math.sin(player.a)),
         player.y + player.r * (2/3 * Math.sin(player.a) + Math.cos(player.a))
      );
   
      // Fecha caminho e desenha linhas
      ctx.closePath();
      ctx.stroke();

      // Desenha bolinha de guia
      ctx.fillStyle = "red";
      ctx.fillRect(player.x-1, player.y-1, 3, 3);

      // Desenha "thrust"
      ctx.strokeStyle = "red";
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Linha esquerda
      if(player.thrust && thurstCoolDown == DIV-1) {
         // Comeca desenhando na parte de baixo
         ctx.moveTo(
            player.x - player.r * (2/3 * Math.cos(player.a) - Math.sin(player.a)) / 3,
            player.y + player.r * (2/3 * Math.sin(player.a) + Math.cos(player.a)) / 3 
         );

         ctx.lineTo(
            player.x - player.r * Math.cos(player.a),
            player.y + player.r * Math.sin(player.a)
         );

         ctx.lineTo(
            player.x - player.r * (2/3 * Math.cos(player.a) + Math.sin(player.a)) / 3,
            player.y + player.r * (2/3 * Math.sin(player.a) - Math.cos(player.a)) / 3
         );
      
         // Fecha caminho e desenha linhas
         ctx.stroke();
      }
   }

   // Move e rotaciona player de acordo com velocidades
   move() {
      player.x += player.dx;
      player.y += player.dy;
      player.a += player.rot;
   }

   // Retorna player a tela caso tenha saido
   edges() {
      // Saiu no sentido negativo
      if(player.x < -player.r){
         player.x = canvas.width + player.r;
      } else if(player.y < -player.r) {
         player.y = canvas.height + player.r;
      }

      // Saiu no sentido positivo
      if(player.x > canvas.width + player.r){
         player.x = player.r;
      } else if(player.y > canvas.height + player.r) {
         player.y = player.r;
      }
   }
}

// Cria player e seta intervalo de update
var player = new Player();
setInterval(update, 1000 / FPS);

// Funcao para tratamento de teclas
function keyDown(/** @type {KeyboardEvent} */ ev) {
   switch(ev.keyCode) {
      // W ou Cima
      case 87:
      case 38:
         player.thrust = true;
         break;

      // A ou Esquerda
      case 65:
      case 37:
         player.rot = TURN_SPEED / 180 * Math.PI / FPS;
         break;
      
      // D ou Direita
      case 68:
      case 39:
         player.rot = -TURN_SPEED / 180 * Math.PI / FPS;
         break;
   }
}

// Funcao para tratamento de teclas
function keyUp(/** @type {KeyboardEvent} */ ev) {
   switch(ev.keyCode) {
      // W ou Cima
      case 87:
      case 38:
         player.thrust = false;
         break;

      // A ou Esquerda, D ou Direita
      case 65:
      case 37:
      case 68:
      case 39:
         player.rot = 0;
         break;
   }
}

// Loop principal do jogo
function update() {
   ctx.fillStyle = "black";
   ctx.fillRect(0, 0, canvas.width, canvas.height);
   
   if(player.thrust && (player.dx <= 10 && player.dy <= 10)) {
      player.dx += THRUST * Math.cos(player.a) / FPS;
      player.dy -= THRUST * Math.sin(player.a) / FPS;
   } else {
      player.dx -= FRICTION * player.dx / FPS;
      player.dy -= FRICTION * player.dy / FPS;
   }

   player.draw();
   player.move();
   player.edges();

   thurstCoolDown = (thurstCoolDown + 1) % DIV;
}