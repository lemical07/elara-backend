export default class ReaccionResumenDTO {
    #review_id;
    #total_likes;
    #total_dislikes;

    constructor(data) {
        this.#review_id = Number(data.review_id);
        this.#total_likes = Number(data.total_likes);
        this.#total_dislikes = Number(data.total_dislikes);
    }

    set review_id(review_id) { this.#review_id = Number(review_id); }
    set total_likes(total_likes) { this.#total_likes = Number(total_likes); }
    set total_dislikes(total_dislikes) { this.#total_dislikes = Number(total_dislikes); }

    get review_id() { return this.#review_id; }
    get total_likes() { return this.#total_likes; }
    get total_dislikes() { return this.#total_dislikes; }

    get data() {
        return {
            review_id: this.#review_id,
            total_likes: this.#total_likes,
            total_dislikes: this.#total_dislikes
        };
    }
}
