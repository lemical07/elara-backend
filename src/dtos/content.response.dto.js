export class ContenidoObtenerDTO {
    #id;
    #titulo;
    #descripcion;
    #anio;
    #tipo;
    #categoria;
    #director;
    #urlImagen;
    #urlTrailer;
    #estado;
    #personajes;

    constructor(contenido) {
        this.#id = contenido.id;
        this.#titulo = contenido.titulo;
        this.#descripcion = contenido.descripcion;
        this.#anio = contenido.anio;
        this.#tipo = contenido.tipo;
        this.#categoria = contenido.categoria_nombre;
        this.#director = contenido.director;
        this.#urlImagen = contenido.url_imagen;
        this.#urlTrailer = contenido.url_trailer;
        this.#estado = contenido.estado;
        this.#personajes = contenido.personajes || [];
    }

    get id() { return this.#id; }
    get titulo() { return this.#titulo; }
    get descripcion() { return this.#descripcion; }
    get anio() { return this.#anio; }
    get tipo() { return this.#tipo; }
    get categoria() { return this.#categoria; }
    get director() { return this.#director; }
    get urlImagen() { return this.#urlImagen; }
    get urlTrailer() { return this.#urlTrailer; }
    get estado() { return this.#estado; }
    get personajes() { return this.#personajes; }

    set id(id) { this.#id = id; }
    set titulo(titulo) { this.#titulo = titulo; }
    set descripcion(descripcion) { this.#descripcion = descripcion; }
    set anio(anio) { this.#anio = anio; }
    set tipo(tipo) { this.#tipo = tipo; }
    set categoria(categoria) { this.#categoria = categoria; }
    set director(director) { this.#director = director; }
    set urlImagen(urlImagen) { this.#urlImagen = urlImagen; }
    set urlTrailer(urlTrailer) { this.#urlTrailer = urlTrailer; }
    set estado(estado) { this.#estado = estado; }
    set personajes(personajes) { this.#personajes = personajes; }

    get data() {
        return {
            id: this.#id,
            titulo: this.#titulo,
            descripcion: this.#descripcion,
            anio: this.#anio,
            tipo: this.#tipo,
            categoria: this.#categoria,
            director: this.#director,
            urlImagen: this.#urlImagen,
            urlTrailer: this.#urlTrailer,
            estado: this.#estado,
            personajes: this.#personajes
        };
    }
}