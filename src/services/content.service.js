import { ContentRepository } from '../repositories/content.repository.js';
import { ContentResponseDto } from '../dtos/content.response.dto.js';
import { ContentPublicResponseDto } from '../dtos/content.public.responseDto.js';

export class ContentService {
    constructor() {
        this.contentRepository = new ContentRepository();
    }

    async obtenerDetalleProducto(id) {
        const content = await this.contentRepository.listarPerId(id);
        if (!content) {
            throw new Error('Contenido no encontrado');
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