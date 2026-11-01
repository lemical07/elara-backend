export class ContenidoPublicoDTO {
    #id;
    #titulo;
    #categoria;
    #anioLanzamiento;
    #tipo;

    constructor(contenido) {
        this.#id = contenido.id;
        this.#titulo = contenido.titulo;
        this.#categoria = contenido.nombre_categoria || contenido.categoria;
        this.#anioLanzamiento = contenido.anio_lanzamiento;
        this.#tipo = contenido.tipo; 
    }

    get id() {return this.#id};
    get titulo() {return this.#titulo};
    get categoria() {return this.#categoria};
    get anioLanzamiento() {return this.#anioLanzamiento};
    get tipo() {return this.#tipo};

    set titulo(nuevoTitulo) {this.#titulo = nuevoTitulo; };
    set categoria(nuevaCategoria) { this.#categoria = nuevaCategoria};
    set anioLanzamiento(nuevoAnio) {this.#anioLanzamiento = nuevoAnio };
    set tipo(nuevoTipo) {this.#tipo = nuevoTipo};

    get data() {
        return {
            id: this.#id,
            titulo: this.#titulo,
            categoria: this.#categoria,
            anioLanzamiento: this.#anioLanzamiento,
            tipo: this.#tipo
        };
    }
}