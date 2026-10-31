export default class ReaccionObtenerDTO {
    #review_id;
    #tipo;
    #review_titulo;
    #review_calificacion;
    #contenido_titulo;

    constructor(data) {
        this.#review_id = data.review_id;
        this.#tipo = data.tipo;
        this.#review_titulo = data.review_titulo;
        this.#review_calificacion = data.review_calificacion;
        this.#contenido_titulo = data.contenido_titulo;
    }

    set review_id(review_id) { this.#review_id = review_id; }
    set tipo(tipo) { this.#tipo = tipo; }
    set review_titulo(review_titulo) { this.#review_titulo = review_titulo; }
    set review_calificacion(review_calificacion) { this.#review_calificacion = review_calificacion; }
    set contenido_titulo(contenido_titulo) { this.#contenido_titulo = contenido_titulo; }

    get review_id() { return this.#review_id; }
    get tipo() { return this.#tipo; }
    get review_titulo() { return this.#review_titulo; }
    get review_calificacion() { return this.#review_calificacion; }
    get contenido_titulo() { return this.#contenido_titulo; }

    get data() {
        return {
            review_id: this.#review_id,
            tipo: this.#tipo,
            review_titulo: this.#review_titulo,
            review_calificacion: this.#review_calificacion,
            contenido_titulo: this.#contenido_titulo
        };
    }
}
