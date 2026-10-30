export default class ReviewReadDto {
    #id;
    #contenido_id;
    #contenido_titulo;
    #titulo;
    #comentario;
    #calificacion;
    #creado_en;
    #actualizado_en;
    #autor;

    constructor(data) {
        this.#id = data.id;
        this.#contenido_id = data.contenido_id;
        this.#contenido_titulo = data.contenido_titulo;
        this.#titulo = data.titulo;
        this.#comentario = data.comentario;
        this.#calificacion = data.calificacion;
        this.#creado_en = data.creado_en;
        this.#actualizado_en = data.actualizado_en;
        this.#autor = {
            nombre: data.autor_nombre,
            apellido: data.autor_apellido
        };
    }

    get id() { return this.#id; }
    get contenido_id() { return this.#contenido_id; }
    get contenido_titulo() { return this.#contenido_titulo; }
    get titulo() { return this.#titulo; }
    get comentario() { return this.#comentario; }
    get calificacion() { return this.#calificacion; }
    get creado_en() { return this.#creado_en; }
    get actualizado_en() { return this.#actualizado_en; }
    get autor() { return { ...this.#autor }; }

    get data() {
        return {
            id: this.#id,
            contenido_id: this.#contenido_id,
            contenido_titulo: this.#contenido_titulo,
            titulo: this.#titulo,
            comentario: this.#comentario,
            calificacion: this.#calificacion,
            creado_en: this.#creado_en,
            actualizado_en: this.#actualizado_en,
            autor: { ...this.#autor }
        };
    }
}
