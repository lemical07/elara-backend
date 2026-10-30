export class ContenidoPublicoRespuestaDto {
    #titulo;
    #categoria;
    #anioLanzamiento;
    #tipo;

    constructor(contenido) {
        this.#titulo = contenido.titulo;
        this.#categoria = contenido.nombre_categoria || contenido.categoria;
        this.#anioLanzamiento = contenido.anio_lanzamiento;
        this.#tipo = contenido.tipo; 
    }

    // Getters
    get titulo() {return this.#titulo};
    get categoria() {return this.#categoria};
    get anioLanzamiento() {return this.#anioLanzamiento};
    get tipo() {return this.#tipo};

    // Setters
    set titulo(nuevoTitulo) {this.#titulo = nuevoTitulo; };
    set categoria(nuevaCategoria) { this.#categoria = nuevaCategoria};
    set anioLanzamiento(nuevoAnio) {this.#anioLanzamiento = nuevoAnio };
    set tipo(nuevoTipo) {this.#tipo = nuevoTipo};

    aJSON() {
        return {
            titulo: this.#titulo,
            categoria: this.#categoria,
            anioLanzamiento: this.#anioLanzamiento,
            tipo: this.#tipo
        };
    }
}