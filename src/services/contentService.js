import { ContentRepository } from '../repositories/contentRepository.js';
import { ContentResponseDto } from '../dtos/contentResponseDto.js';
import { ContentPublicResponseDto } from '../dtos/contentPublicResponseDto.js';

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

    async obtenerCatalogoPublico(categoriaFiltro) {
        const contenidosCrudos = await contenidoRepositorio.buscarAprobados(categoriaFiltro);
        
        return contenidosCrudos.map(item => {
            const dto = new ContentPublicResponseDto(item);
            return dto.aJSON();
        });
    }
}