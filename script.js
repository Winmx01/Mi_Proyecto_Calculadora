let pantalla = document.getElementById('pantalla');
let operacionActual = '';
let operatorAnterior = null;
let esperandoOperando = false;

function actualizarPantalla() {
    pantalla.textContent = operacionActual || '0';
}

function limpiar() {
    operacionActual = '';
    operatorAnterior = null;
    esperandoOperando = false;
    actualizarPantalla();
}

function borrar() {
    if (operacionActual.length > 0) {
        operacionActual = operacionActual.slice(0, -1);
        actualizarPantalla();
    }
}

function agregarNumero(numero) {
    if (esperandoOperando) {
        operacionActual = numero;
        esperandoOperando = false;
    } else {
        operacionActual = operacionActual === '0' ? numero : operacionActual + numero;
    }
    actualizarPantalla();
}
 
function agregarPunto() {
    if (esperandoOperando) {
        operacionActual = '0.';
        esperandoOperando = false;
    } else  if (operacionActual.indexOf('.') === -1) {
        operacionActual += '.';
    }
    actualizarPantalla();
}

function agregarOperador(operador) {
    if (operacionActual === '') return;

    if (operatorAnterior !== null && !esperandoOperando) {
        calcular();
    }

    operatorAnterior = operador;
    operacionActual += ' ' + operador + ' ';
    esperandoOperando = false;
    actualizarPantalla();
}

function calcular() {
    if (operatorAnterior === null || esperandoOperando) return;

    try {
        //Remplazar x por * para la evaluacion
        let expresion = operacionActual.replace(/x/g, '*');
    
    // Evaluar la expresion de forma segura
    let resultado = Function('"use strict"; return (' + expresion + ')')();

    //Redondear el reusultado  para evitar problemas 
    resultado = Math.round((resultado + Number.EPSILON) * 100000000) / 100000000;

    operacionActual = resultado.toString();
    operatorAnterior = null;
    esperandoOperando = true;
    actualizarPantalla();
    } catch (error) {
        operacionActual = 'Error';
        operatorAnterior = null;
        esperandoOperando = true;
        actualizarPantalla();
    }
}

//Soporte para teclado
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        agregarNumero(key);
    } else if (key === '.') {
        agregarPunto();
    } else if (key === '+' || key === '-') {
        agregarOperador(key);
    } else if (key === '*') {
        agregarOperador('*');
    } else if (key === '/') {
        event.preventDefault();
        agregarOperador('/');
    } else if (key === 'Enter' || key === '=') {
        calcular();
    } else if (key === 'Escape') {
        limpiar();
    } else if (key === 'Backspace') {
        borrar();
    }
});

//Inicializar
actualizarPantalla();