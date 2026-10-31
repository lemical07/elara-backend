
export const validarDatosPropuesta = (datos) => {
    const { titulo, descripcion, anio, tipo, categoriaId } = datos;

    if (!titulo || titulo.trim() === '') {
        return 'El título del contenido es obligatorio.';
    }
    if (!descripcion || descripcion.trim() === '') {
        return 'La descripción es obligatoria.';
    }
    if (!anio || isNaN(anio)) {
        return 'El año de estreno es obligatorio y numérico.';
    }
    if (!tipo || !['pelicula', 'serie', 'anime'].includes(tipo.toLowerCase())) {
        return 'El tipo de contenido debe ser: pelicula, serie o anime.';
    }
    if (!categoriaId || isNaN(categoriaId)) {
        return 'El identificador de la categoría es obligatorio y numérico.';
    }

    return null;
};