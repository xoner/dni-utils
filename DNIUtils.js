/**
 * Compendio de utilidades para el calculo y comprobacion del digito de control de los DNI/NIE Españoles.
 * Algoritmo basado en la descripcion presente en: http://www.interior.gob.es/ca/web/servicios-al-ciudadano/dni/calculo-del-digito-de-control-del-nif-nie
 */
function DNIUtils() {};

// Para verificar el NIF de españoles residentes mayores de edad, el algoritmo de cálculo del dígito de control es el siguiente:
// Se divide el número entre 23 y el resto se sustituye por una letra que se determina por inspección mediante la siguiente tabla:
// 
// RESTO	0	1	2	3	4	5	6	7	8	9	10	11
// LETRA	T	R	W	A	G	M	Y	F	P	D	X	B
//  
// 
// RESTO	12	13	14	15	16	17	18	19	20	21	22
// LETRA	N	J	Z	S	Q	V	H	L	C	K	E
DNIUtils.prototype.tablaDigitoControl = ['T','R','W','A','G','M','Y','F','P','D','X','B','N','J','Z','S','Q','V','H','L','C','K','E'];

// Los NIE's de extranjeros residentes en España tienen una letra (X, Y, Z), 7 números y dígito de control.
// Para el cálculo del dígito de control se sustituye:
// 
// X → 0
// Y → 1
// Z → 2
// y se aplica el mismo algoritmo que para el NIF.
DNIUtils.prototype.tablaSustitucionNIE = {'X':0, 'Y':1, 'Z':2};


/**
 * @description Calcula la letra de control correspondiente que le corresponda al parametro dni si este se corresponde con un dni/nie valido.
 * @param {string} dni - cadena que se supone representa un dni/nie valido.
 * @returns {string} La letra de control del DNI/NIE si este es valido, cadena vacia en caso contrario.
 */
DNIUtils.prototype.calculaLetraDNI = function(dni) {
    let dniString = dni.toString();

    let reDNIValido = /(\d{8})/g;

    let matchDNIValido = reDNIValido.exec(dniString);

    if(matchDNIValido !== null && matchDNIValido.length === 2){
        let indiceControl = Number(dniString) % 23;

        return this.tablaDigitoControl[indiceControl];
    }

    let reNIEValido = /([X|Y|Z]{1})(\d{7})/g;

    let matchNIEValido = reNIEValido.exec(dniString);

    if(matchNIEValido !== null && matchNIEValido !== 3) {
        let letraNIE = matchNIEValido[1].toUpperCase();
        let numeroNIE = matchNIEValido[2];

        let numNIEConverted = this.tablaSustitucionNIE[letraNIE] + numeroNIE;

        let indControlNIE = Number(numeroNIEConverted) % 23;

        return this.tablaDigitoControl[indControlNIE];
    }

    return "";
}

/**
 * @description Comprueba que el parametro dni se corresponde con una representación valida de un dni/nie.
 * @param {Object} dni - objeto a comprobar si se trata de una representación de un dni/nie valido.
 * @returns {Boolean} true si el parametro dni se corresponde con un dni/nie válido, false en caso contrario.
 */
DNIUtils.prototype.validaDNI = function(dni) {
    let dniString = dni.toString();

    // Comprobar se se trata de un dni valido.
    let reDNIValido = /(\d{8})([a-z|A-Z]{1})/g;
    let matchDNIValido = reDNIValido.exec(dniString);
    
    if(matchDNIValido !== null && matchDNIValido.length === 3) {
        let numDNI = matchDNIValido[1];
        let letraDNI = matchDNIValido[2].toUpperCase();

        if(this.calculaLetraDNI(numDNI) === letraDNI){
            return true;
        }
    }

    // comprobar si se trata de un nie valido.
    let reNIEValido = /([X|Y|Z]{1})(\d{7})([a-z|A-Z]{1})/g;
    let matchNIEValido = reNIEValido.exec(dniString);

    if(matchNIEValido !== null && matchNIEValido.length === 4) {
        let numNIE = matchNIEValido[1].toUpperCase() + matchNIEValido[2];
        let letraNIE = matchNIEValido[2];

        if(this.calculaLetraDNI(numNIE) === letraNIE) {
            return true;
        }
    }

    return false;
}
