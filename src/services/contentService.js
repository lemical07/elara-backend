import { ContentRepository } from '../repositories/contentRepository.js';
import { ContentResponseDto } from '../dtos/contentResponseDto.js';

export class ContentService {
    constructor() {
        this.contentRepository = new ContentRepository();
    }

    async getContentDetail(id) {
        const content = await this.contentRepository.findById(id);
        if (!content) {
            throw new Error('Contenido no encontrado');
        }

        const characters = await this.contentRepository.findCharactersByContentId(id);
        content.personajes = characters;

        return new ContentResponseDto(content);
    }
}