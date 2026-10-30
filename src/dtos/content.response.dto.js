export class ContentResponseDto {
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

    constructor(content) {
        this.#id = content.id;
        this.#titulo = content.titulo;
        this.#descripcion = content.descripcion;
        this.#anio = content.anio;
        this.#tipo = content.tipo;
        this.#categoria = content.categoria_nombre;
        this.#director = content.director;
        this.#urlImagen = content.url_imagen;
        this.#urlTrailer = content.url_trailer;
        this.#estado = content.estado;
        this.#personajes = content.personajes || [];
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

    set id(value) { this.#id = value; }
    set titulo(value) { this.#titulo = value; }
    set descripcion(value) { this.#descripcion = value; }
    set anio(value) { this.#anio = value; }
    set tipo(value) { this.#tipo = value; }
    set categoria(value) { this.#categoria = value; }
    set director(value) { this.#director = value; }
    set urlImagen(value) { this.#urlImagen = value; }
    set urlTrailer(value) { this.#urlTrailer = value; }
    set estado(value) { this.#estado = value; }
    set personajes(value) { this.#personajes = value; }
}