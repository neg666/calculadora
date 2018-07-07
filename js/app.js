var Calculadora = {};
Calculadora = ( function () {
    var pulsada, pantalla, valor, potencia, valor1, valor2, operacion;

    /* Inicialización de la calculadora */
    iniciarCalculadora();

    /**
     * Procesa las acciones a aseguir, cada vez que se pulsa una
     * tecla. Muestra la tecla más reducida, generando el efecto
     * visual de "presión" sobre ella. El efecto está basado en
     * aumentar un borde del mismo color de fondo.
     */
    function tocarTecla() {
        pulsada = this;
        this.style.borderWidth = this.id != 'mas' ? '3px' : '6px 3px 4px 0';
        switch ( this.id ) {
        case "on":
            valor = 0;
            valor2 = null;
            potencia = 0;
            operacion = null;
            break;
        case "sign":
            valor *= -1;
            break;
        case "punto":
            potencia = ( potencia == 0 ) ? -1 : potencia;
            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if ( valor2 !== null ) return;
            var signo = Math.sign( valor ) | 1;
            if ( digitos( valor, potencia ) == 8 || potencia < -8 ) return;
            valor = Math.abs( valor );
            if ( potencia == 0 )
                valor = valor * 10 + parseInt( this.id );
            else
                valor += parseInt( this.id ) * Math.pow( 10, potencia-- );
            valor *= signo;
            valor2 = null;
            break;
        case "mas":
        case "menos":
        case "por":
        case "dividido":
            if ( valor == 0 ) return;
            valor1 = valor;
            valor2 = null;
            valor  = 0;
            potencia  = 0;
            operacion = this.id;
            break;
        case "igual":
            if ( operacion == null || valor1 == null ) return;
            if ( valor2 == null )
                valor2 = valor;
            else
                valor1 = valor;
            switch ( operacion ) {
            case "mas":
                valor = valor1 + valor2;
                break;
            case "menos":
                valor = valor1 - valor2;
                break;
            case "por":
                valor = valor1 * valor2;
                break;
            case "dividido":
                valor = valor1 / valor2;
                break;
            }
            break;
        case "raiz":
        default:
            return; // No implementado
        }
        actualizarPantalla();
    }

    /**
     * Genera el efecto de "soltar" la tecla, devolviéndola a su
     * tamaño original.
     */
    function soltarTecla() {
        pulsada.style.borderWidth = '0';
    }

    /**
     * Procesa el valor actual en memoria y lo despliega en pantalla
     */
    function actualizarPantalla() {
        var literal = valor.toString(), pos = literal.indexOf( '.' );
        if ( literal.length > 10 ) {
            potencia = pos ? -Math.min( 7, literal.length - pos - 1 ) : 0;
            valor = valor.toFixed( -potencia );
        }
        literal = valor.toString() + ( potencia < 0 && literal.indexOf( "." ) < 0 ? "." : "" );
        literal = ( literal == "0" && operacion != null ) ? "" : literal.substring( 0, 8 );
        pantalla.innerHTML = literal;
        valor = Number( literal );
    }

    /**
     * Establece el valor inicial de las variables. Asigna eventos a
     * todas las teclas. Muestra el primer despliegue de pantalla
     */
    function iniciarCalculadora() {
        valor = 0;
        potencia = 0;
        operacion = null;
        valor2 = null;
        pantalla = document.getElementById( 'display' );
        var teclas = document.querySelectorAll( '.tecla' );
        for ( var i = 0; i < teclas.length; i++ ) {
            teclas[i].style.width = "78px";
            teclas[i].style.border = '0 solid #999';
            teclas[i].onmousedown = tocarTecla;
            teclas[i].onmouseup = soltarTecla;
        }
        actualizarPantalla();
    }

    /**
     * Calcula la cantidad de dígitos que tiene el valor, incluyendo
     * la parte entera y la parte decimal
     */
    function digitos( n, p ) {
        n = Math.abs( n );
        if ( n < 10 ) return 1;
        return Math.floor( Math.log10( n ) ) + 1 - ( p < 0 ? p + 1 : 0 );
    }
}());
