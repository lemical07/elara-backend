import { ContentRepository } from '../repositories/content.repository.js';
import { ContentResponseDto } from '../dtos/content.response.dto.js';
import { ContentPublicResponseDto } from '../dtos/content.public.responseDto.js';

export class ContentService {
    constructor() {
        this.contentRepository = new ContentRepository();
    }

<<<<<<< HEAD:src/services/contentService.js
    async getApprovedContent() {
        const content = await this.contentRepository.findApproved();
        return content.map(item => new ContentResponseDto(item));
    }

    async getContentDetail(id) {
        const content = await this.contentRepository.findById(id);
=======
    async obtenerDetalleProducto(id) {
        const content = await this.contentRepository.listarPerId(id);
>>>>>>> feature/services:src/services/content.service.js
        if (!content) {
            const error = new Error('Contenido no encontrado');
            error.status = 404;
            throw error;
        }

        const characters = await this.contentRepository.listarPersonajePerContenidoId(id);
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