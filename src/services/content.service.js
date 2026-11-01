import { ContenidoRepositorio } from '../repositories/content.repository.js';
import { ContenidoObtenerDTO } from '../dtos/content.response.dto.js';
import { ContenidoPublicoDTO } from '../dtos/content.public.response.dto.js';

export class ContenidoServicio {
    constructor(repositorio = new ContenidoRepositorio()) {
        this.contenidoRepositorio = repositorio;
    }

    async obtenerDetalle(id) {
        const contenido = await this.contenidoRepositorio.buscarPorId(id);
        if (!contenido) {
            throw this.crearError('Contenido no encontrado.', 404);
        }

        const personajes = await this.contenidoRepositorio.listarPersonajesPorContenidoId(id);
        contenido.personajes = personajes;

        return new ContenidoObtenerDTO(contenido).data;

        
    }

    async obtenerCatalogoPublico(filtros) {
        const contenidos = await this.contenidoRepositorio.listarAprobadosPorFiltros(filtros);
        return contenidos.map(contenido => new ContenidoPublicoDTO(contenido).data);
    }

    async crearAprobado(datos) {
        await this.verificarCategoria(datos.categoria_id);
        const id = await this.contenidoRepositorio.crearAprobado(datos);
        return this.obtenerDetalleAdministrativo(id);
    }

    async actualizar(id, datos) {
        await this.obtenerExistente(id);
        await this.verificarCategoria(datos.categoria_id);
        await this.contenidoRepositorio.actualizar(id, datos);
        return this.obtenerDetalleAdministrativo(id);
    }

    async eliminar(id) {
        await this.obtenerExistente(id);
        const eliminado = await this.contenidoRepositorio.eliminar(id);
        if (!eliminado) {
            throw this.crearError('Contenido no encontrado.', 404);
        }
    }

    async listarPersonajes(id) {
        await this.obtenerDetalle(id);
        return this.contenidoRepositorio.listarPersonajesPorContenidoId(id);
    }

    async crearPersonaje(id, { nombre, tipo }) {
        await this.obtenerExistente(id);
        const personajeId = await this.contenidoRepositorio.crearPersonaje(id, nombre, tipo);
        return { id: personajeId, contenido_id: Number(id), nombre: nombre.trim(), tipo };
    }

    async actualizarPersonaje(id, personajeId, { nombre, tipo }) {
        await this.obtenerExistente(id);
        const actualizado = await this.contenidoRepositorio.actualizarPersonaje(id, personajeId, nombre, tipo);
        if (!actualizado) {
            throw this.crearError('Personaje no encontrado para este contenido.', 404);
        }
        return { id: Number(personajeId), contenido_id: Number(id), nombre: nombre.trim(), tipo };
    }

    async eliminarPersonaje(id, personajeId) {
        await this.obtenerExistente(id);
        const eliminado = await this.contenidoRepositorio.eliminarPersonaje(id, personajeId);
        if (!eliminado) {
            throw this.crearError('Personaje no encontrado para este contenido.', 404);
        }
    }

    async obtenerDetalleAdministrativo(id) {
        const contenido = await this.contenidoRepositorio.buscarAdministrativoPorId(id);
        if (!contenido) {
            throw this.crearError('Contenido no encontrado.', 404);
        }
        contenido.personajes = await this.contenidoRepositorio.listarPersonajesPorContenidoId(id);
        return new ContenidoObtenerDTO(contenido).data;
    }

    async obtenerExistente(id) {
        if (!(await this.contenidoRepositorio.existeContenido(id))) {
            throw this.crearError('Contenido no encontrado.', 404);
        }
    }

    async verificarCategoria(id) {
        if (!(await this.contenidoRepositorio.existeCategoria(id))) {
            throw this.crearError('Categoría no encontrada.', 404);
        }
    }

    crearError(mensaje, status) {
        const error = new Error(mensaje);
        error.status = status;
        return error;
    }
}