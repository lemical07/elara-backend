import { ContentRepository } from '../repositories/contentRepository.js';
import { ContentResponseDto } from '../dtos/contentResponseDto.js';

export class ContentService {
    constructor() {
        this.contentRepository = new ContentRepository();
    }

    async getApprovedContent() {
        const content = await this.contentRepository.findApproved();
        return content.map(item => new ContentResponseDto(item));
    }

    async getContentDetail(id) {
        const content = await this.contentRepository.findById(id);
        if (!content) {
            const error = new Error('Contenido no encontrado');
            error.status = 404;
            throw error;
        }

        const characters = await this.contentRepository.findCharactersByContentId(id);
        content.personajes = characters;

        return new ContentResponseDto(content);
    }
}