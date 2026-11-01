export default class UsuarioCrearDTO{
    #rol_id;
    #nombre;
    #apellido;
    #correo;
    #contrasena;

    constructor(data){
        this.#rol_id = data.rol_id;
        this.#nombre = data.nombre;
        this.#apellido = data.apellido;
        this.#correo = data.correo;
        this.#contrasena = data.contrasena;
    }

    set rol_id(rol_id){this.#rol_id = rol_id};
    set nombre(nombre){this.#nombre = nombre};
    set correo(correo){this.#correo = correo};
    set telefono(apellido){this.#apellido = apellido};
    set contrasena(contrasena){this.#contrasena = contrasena};

    get rol_id(){return this.#rol_id};
    get nombre(){return this.#nombre};
    get correo(){return this.#correo};
    get apellido(){return this.#apellido};
    get contrasena(){return this.#contrasena};
};