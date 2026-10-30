export default class ReviewCreateDto {
    #titulo;
    #comentario;
    #calificacion;

    constructor(data) {
        this.#titulo = data.titulo.trim();
        this.#comentario = data.comentario ?? null;
        this.#calificacion = data.calificacion;
    }

    set titulo(titulo) { this.#titulo = titulo; }
    set comentario(comentario) { this.#comentario = comentario; }
    set calificacion(calificacion) { this.#calificacion = calificacion; }

    get titulo() { return this.#titulo; }
    get comentario() { return this.#comentario; }
    get calificacion() { return this.#calificacion; }

    get data() {
        return {
            titulo: this.#titulo,
            comentario: this.#comentario,
            calificacion: this.#calificacion
        };
    }
}
