export default class ReaccionActualizarDTO {
    #tipo;

    constructor(data) {
        this.#tipo = data.tipo;
    }

    set tipo(tipo) { this.#tipo = tipo; }
    get tipo() { return this.#tipo; }

    get data() {
        return { tipo: this.#tipo };
    }
}