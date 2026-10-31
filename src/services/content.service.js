import { ContenidoRepositorio } from '../repositories/content.repository.js';
import { ContenidoObtenerDTO } from '../dtos/content.response.dto.js';
import { ContenidoPublicoDTO } from '../dtos/content.public.response.dto.js';

export class ContenidoServicio {
    constructor() {
        this.contenidoRepositorio = new ContenidoRepositorio();
    }

    async obtenerDetalle(id) {
        const contenido = await this.contenidoRepositorio.buscarPorId(id);
        if (!contenido) {
            throw new Error('Contenido no encontrado');
        }

        const personajes = await this.contenidoRepositorio.listarPersonajesPorContenidoId(id);
        contenido.personajes = personajes;

        return new ContenidoObtenerDTO(contenido).data;

        
    }

    async obtenerCatalogoPublico(categoriaFiltro) {
        const contenidosCrudos = await this.contenidoRepositorio.listarAprobadosPorCategoria(categoriaFiltro);
        
        return contenidosCrudos.map(contenido => {
            const dto = new ContenidoPublicoDTO(contenido);
            return dto.data;
        });
    }
}