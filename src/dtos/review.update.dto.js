export default class ReviewUpdateDto {
    #titulo;
    #comentario;
    #calificacion;

    constructor(data) {
        this.#titulo = Object.hasOwn(data, 'titulo') ? data.titulo.trim() : undefined;
        this.#comentario = Object.hasOwn(data, 'comentario') ? data.comentario : undefined;
        this.#calificacion = Object.hasOwn(data, 'calificacion') ? data.calificacion : undefined;
    }

    set titulo(titulo) { this.#titulo = titulo; }
    set comentario(comentario) { this.#comentario = comentario; }
    set calificacion(calificacion) { this.#calificacion = calificacion; }

    get titulo() { return this.#titulo; }
    get comentario() { return this.#comentario; }
    get calificacion() { return this.#calificacion; }

    get data() {
        return Object.fromEntries(
            Object.entries({
                titulo: this.#titulo,
                comentario: this.#comentario,
                calificacion: this.#calificacion
            }).filter(([, value]) => value !== undefined)
        );
    }
}
