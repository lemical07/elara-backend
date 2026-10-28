export default class UsuarioObtenerDTO{
    #id
    #rol_id;
    #nombre;
    #apellido;
    #correo;
    #activo

    constructor(data){
        this.#id = data.id;
        this.#rol_id = data.rol_id;
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;
        this.#correo = data.correo;
        this.#activo = data.activo;
    }

    set id(id){this.#id = id};
    set rol_id(rol_id){this.#rol_id = rol_id};
    set nombre(nombre){this.#nombre = nombre};
    set correo(correo){this.#correo = correo};
    set telefono(apellido){this.#apellido = apellido};
    set activo(activo){this.#activo = activo};

    get id(){return this.#id};
    get rol_id(){return this.#rol_id};
    get nombre(){return this.#nombre};
    get correo(){return this.#correo};
    get apellido(){return this.#apellido};
    get activo(){return this.#activo};

    get data(){
        return{
            id: this.#id,
            nombre: this.#nombre,
            correo: this.#correo,
            apellido: this.#apellido,
            activo: this.#activo,
            activo: this.#activo
        }
    }
};