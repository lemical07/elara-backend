export class ContentResponseDto {
    constructor(content) {
        this.id = content.id;
        this.titulo = content.titulo;
        this.descripcion = content.descripcion;
        this.anio = content.anio;
        this.tipo = content.tipo;
        this.categoria = content.categoria_nombre;
        this.director = content.director;
        this.urlImagen = content.url_imagen;
        this.urlTrailer = content.url_trailer;
        this.estado = content.estado;
        this.personajes = content.personajes || [];
    }
}