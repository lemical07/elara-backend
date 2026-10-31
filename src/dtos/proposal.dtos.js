class ProposalResponseDto {
    #idPropuesta;
    #titulo;
    #tipoContenido;
    #estadoActual;
    #mensajeInformativo;
    #fechaEnvio;

    constructor(registroPropuesta) {
        this.idPropuesta = registroPropuesta.id;
        this.titulo = registroPropuesta.titulo;
        this.tipoContenido = registroPropuesta.tipo;
        this.estadoActual = registroPropuesta.estado;
        this.mensajeInformativo = 'Su propuesta fue recibida exitosamente y está pendiente de revisión por parte del equipo administrativo antes de aparecer en el catálogo público.';
        this.fechaEnvio = registroPropuesta.creado_en;
    }

    get idPropuesta() { return this.#idPropuesta; }
    get titulo() { return this.#titulo; }
    get tipoContenido() { return this.#tipoContenido; }
    get estadoActual() { return this.#estadoActual; }
    get mensajeInformativo() { return this.#mensajeInformativo; }
    get fechaEnvio() { return this.#fechaEnvio; }

    set idPropuesta(valor) { this.#idPropuesta = valor; }
    set titulo(valor) { this.#titulo = valor; }
    set tipoContenido(valor) { this.#tipoContenido = valor; }
    set estadoActual(valor) { this.#estadoActual = valor; }
    set mensajeInformativo(valor) { this.#mensajeInformativo = valor; }
    set fechaEnvio(valor) { this.#fechaEnvio = valor; }

    toJSON() {
        return {
            idPropuesta: this.#idPropuesta,
            titulo: this.#titulo,
            tipoContenido: this.#tipoContenido,
            estadoActual: this.#estadoActual,
            mensajeInformativo: this.#mensajeInformativo,
            fechaEnvio: this.#fechaEnvio
        };
    }
}

export const formatearRespuestaPropuestaDto = (registro) => {
    const dto = new ProposalResponseDto(registro);
    return dto.toJSON();
};