const zonaJuego = document.getElementById("zonaJuego");
const mensajeElement = document.getElementById("mensaje");
const instruccionesElement = document.getElementById("instrucciones");
const restartTexto = document.getElementById("restart");
const sonido1 = new Audio("casual-click-pop-ui-6-262122.mp3");
const sonido2 = new Audio("select-sound-121244.mp3");
const sonidoGanador = new Audio("winning-218995.mp3");
sonidoGanador.volume = 0.1;
const sonidoPunto = new Audio("woosh-230554.mp3");
sonidoPunto.volume = 0.3;
const sonidoPuntoPerdido = new Audio("arcade-ui-15-229513.mp3");
const sonidoEmpezar = new Audio("arcade-ui-18-229517.mp3");
estadoJuego = "PAUSE"

class paleta{

    element;

    y = 0;
    velocidad = 10;
    movimiento;
    alto = 150;
    ancho = 15;

    constructor(){
        this.element = document.createElement("div");
        this.element.classList = "paleta";
        zonaJuego.appendChild(this.element);
        this.resetPosicion();
    }

    subir(){
        if(!this.movimiento){
        this.movimiento = setInterval(()=> {
            this.y -= this.velocidad;
            if(this.y < 0 ) {
                this.y = 0;
                this.freeze()
            }
            this.element.style.top = this.y+"px";
        } , 20)
    }
    }

    bajar(){
        if(!this.movimiento){
        this.movimiento = setInterval(()=> {
            this.y += this.velocidad;
            const limite = document.body.clientHeight - this.alto;
            if(this.y > limite) {
                this.y = limite;
                this.freeze()
            }
            this.element.style.top = this.y+"px";
        } , 20)
    }
    }

    freeze(){
        clearInterval(this.movimiento);
        this.movimiento = undefined
    }

    resetPosicion(){
        this.freeze();
        this.y = document.body.clientHeight/2 - this.alto/2;
        this.element.style.top = this.y + "px";
    }

}

class bola{
    
    x;
    dx = -15;
    y;
    dy = -15;
    ancho = 20;
    movimiento;

    constructor(){
        this.element = document.createElement("div");
        this.element.classList = "bola";
        zonaJuego.appendChild(this.element);
        this.resetPosicion();
        this.mover();
        mensajeElement.classList = "disable";
        instruccionesElement.classList = "disable";
        j2.element.classList.remove("vibrate");
        j1.element.classList.remove("vibrate");
    }

    resetPosicion(){
        this.x = (document.body.clientWidth + this.ancho) / 2;
        this.element.style.left = this.x+"px";
        this.y = (document.body.clientHeight + this.ancho) / 2;
        this.element.style.top = this.y+"px";
    }

    mover(){
        if(!this.movimiento){
        this.movimiento = setInterval(() => {

// movimiento izquierda a derecha
        this.x += this.dx;

// colision con paleta
    if(this.x < 0 + j1.ancho &&
        this.y + this.ancho/2 > j1.y &&
        this.y + this.ancho/2 < j1.y + j1.alto
    ){
        this.dx = this.dx * -1;
        j1.element.classList.add("vibrate");
        j2.element.classList.remove("vibrate");
        sonido1.play()
    }

    if(this.x + this.ancho > document.body.clientWidth-j2.ancho &&
        this.y + this.ancho/2 > j2.y &&
        this.y + this.ancho/2 < j2.y + j2.alto
    ){
        this.dx = this.dx * -1;
        j2.element.classList.add("vibrate");
        j1.element.classList.remove("vibrate");
        sonido1.play()
    }


    if(this.x < 0 || this.x > document.body.clientWidth){
        canvas.sumar(this.x < 0 ? 2 : 1);
        sonidoPuntoPerdido.play();
    }

        this.element.style.left = this.x+"px";

// movimiento de arriba a abajo
    this.y += this.dy;
    if(this.y < 0 || this.y > document.body.clientHeight - this.ancho){
        sonido2.play();
        this.dy = this.dy*-1; 
    }
    this.element.style.top = this.y+"px";
    } ,20)
    }
    }

    eliminar(){
        clearInterval(this.movimiento);
        zonaJuego.removeChild(this.element)
        bolita = undefined;
    }

}

class tablero{

    j1Score = 0;
    j2Score = 0;
    puntajeMaximo = 5;

    constructor(){
        this.element = document.createElement("p");
        this.element.id = "tablero";
        zonaJuego.appendChild(this.element)
        this.actualizarTexto()
        this.matchPoint = document.createElement("p");
        this.matchPoint.id = "matchPoint";
        this.matchPoint.textContent = "Match Point!";
        this.matchPoint.classList = "disable";
        zonaJuego.append(this.matchPoint)
    }

    actualizarTexto(){
        this.element.textContent = this.j1Score + " - " + this.j2Score;
    }

    sumar(p){
        if(p === 1) {
            this.j1Score++;
            this.element.classList = "rotate-horizontal-center"
        }
        else {
            this.j2Score++;
            this.element.classList = "rotate-horizontal-center"
        }
        if(this.j1Score == this.puntajeMaximo - 1 || this.j2Score == this.puntajeMaximo - 1 && this.j1Score != 5 && this.j2Score != 5){
            this.matchPoint.classList.remove("disable");
        }
        else{
            this.matchPoint.classList.add("disable");
        }
        this.actualizarTexto();
        bolita.eliminar();
        j1.resetPosicion();
        j2.resetPosicion();
        mensajeElement.classList.toggle("disable", false);
        mensajeElement.textContent = 'Press "spacebar" to continue'
        this.estadoJuego = "PAUSE";
        if(this.j1Score >= this.puntajeMaximo){
            this.ganar(1)
        }
        if(this.j2Score >= this.puntajeMaximo){
            this.ganar(2)
        }
    }

    ganar(p){
        mensajeElement.textContent = "The player "+p+" is the winner";
        mensajeElement.classList.toggle("titilar", true);
        sonidoGanador.play();
        restartTexto.classList.remove("disable");
        estadoJuego = "END"
    }

    reset(){
        this.j1Score = 0;
        this.j2Score = 0;
        this.actualizarTexto();
        mensajeElement.classList.toggle("titilar", false);
        restartTexto.classList.add("disable");
    }

}

document.addEventListener("keydown", (e) => {
    switch(e.key){
        case "w":
            j1.subir();
            break;
        case "s":
            j1.bajar();
            break;
        case "ArrowUp":
            j2.subir();
            break;
        case "ArrowDown":
            j2.bajar();
            break;
    }
})

document.addEventListener("keyup", (e) => {
    switch(e.key){
        case "w":
            j1.freeze();
            break;
        case "s":
            j1.freeze();
            break;
        case "ArrowUp":
            j2.freeze();
            break;
        case "ArrowDown":
            j2.freeze();
            break;
        case " ":
            sonidoEmpezar.play();
            canvas.element.classList.toggle("rotate-horizontal-center", false)
            if(estadoJuego === "END") canvas.reset()
            if(!bolita) bolita = new bola();
            estadoJuego = "PLAY"
            break;
    }
})

const j1 = new paleta();
const j2 = new paleta();
let bolita;
const canvas = new tablero();

