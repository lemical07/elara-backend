export default class ReaccionCrearDTO {
    #review_id;
    #tipo;

    constructor(data) {
        this.#review_id = data.review_id;
        this.#tipo = data.tipo;
    }

    set review_id(review_id) { this.#review_id = review_id; }
    set tipo(tipo) { this.#tipo = tipo; }

    get review_id() { return this.#review_id; }
    get tipo() { return this.#tipo; }

}
