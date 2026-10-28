
export default class UsuarioActualizarDTO {
    #nombre;
    #apellido;
    #correo;

    constructor(data) {
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;
        this.#correo = data.correo;
    }

    get nombre() {return this.#nombre;}
    get apellido() {return this.#apellido;}
    get correo() {return this.#correo;}

    get data() {
        return{
            nombre: this.#nombre,
            correo: this.#correo,
            apellido: this.#apellido,
        }
    }
}
