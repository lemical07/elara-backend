export default class UsuarioObtenerDTO{
    #id
    #nombre;
    #apellido;
    #correo;
    #activo
    #rol

    constructor(data){
        this.#id = data.id;
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;
        this.#correo = data.correo;
        this.#activo = data.activo;
        this.#rol = data.nombre_rol;
    }

    set id(id){this.#id = id};
    set nombre(nombre){this.#nombre = nombre};
    set correo(correo){this.#correo = correo};
    set apellido(apellido){this.#apellido = apellido};
    set activo(activo){this.#activo = activo};

    get id(){return this.#id};
    get nombre(){return this.#nombre};
    get correo(){return this.#correo};
    get apellido(){return this.#apellido};
    get activo(){return this.#activo};
    get rol(){return this.#rol};

    get data(){
        return{
            id: this.#id,
            nombre: this.#nombre,
            correo: this.#correo,
            apellido: this.#apellido,
            activo: this.#activo,
            rol: this.#rol
        }
    }
};