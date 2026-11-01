export class PropuestaRespuestaDTO {
    #idPropuesta;
    #titulo;
    #tipoContenido;
    #estadoActual;
    #mensajeInformativo;

    constructor(registroPropuesta) {
        this.idPropuesta = registroPropuesta.id;
        this.titulo = registroPropuesta.titulo;
        this.tipoContenido = registroPropuesta.tipo;
        this.estadoActual = registroPropuesta.estado;
        this.mensajeInformativo = 'Su propuesta fue recibida exitosamente y está pendiente de revisión por parte del equipo administrativo antes de aparecer en el catálogo público.';
    }

    get idPropuesta() { return this.#idPropuesta; }
    get titulo() { return this.#titulo; }
    get tipoContenido() { return this.#tipoContenido; }
    get estadoActual() { return this.#estadoActual; }
    get mensajeInformativo() { return this.#mensajeInformativo; }

    set idPropuesta(valor) { this.#idPropuesta = valor; }
    set titulo(valor) { this.#titulo = valor; }
    set tipoContenido(valor) { this.#tipoContenido = valor; }
    set estadoActual(valor) { this.#estadoActual = valor; }
    set mensajeInformativo(valor) { this.#mensajeInformativo = valor; }
    get data() {
        return {
            idPropuesta: this.#idPropuesta,
            titulo: this.#titulo,
            tipoContenido: this.#tipoContenido,
            estadoActual: this.#estadoActual,
            mensajeInformativo: this.#mensajeInformativo
        };
    }
}