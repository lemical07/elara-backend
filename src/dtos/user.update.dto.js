export default class UsuarioActualizarDTO {
    #nombre;
    #apellido;
    #correo;

    constructor(data) {
        this.#nombre = Object.hasOwn(data, 'nombre') ? data.nombre.trim() : undefined;
        this.#apellido = Object.hasOwn(data, 'apellido') ? data.apellido.trim() : undefined;
        this.#correo = Object.hasOwn(data, 'correo') ? data.correo.trim().toLowerCase() : undefined;
    }

    get nombre() {return this.#nombre;}
    get apellido() {return this.#apellido;}
    get correo() {return this.#correo;}

    get data() {
        return Object.fromEntries(
            Object.entries({
                nombre: this.#nombre,
                apellido: this.#apellido,
                correo: this.#correo
            }).filter(([, valor]) => valor !== undefined)
        );
    }
}
