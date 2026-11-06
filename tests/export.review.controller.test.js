import assert from 'node:assert/strict';
import test from 'node:test';
import { ExportarResenasControlador } from '../src/controllers/export.review.controller.js';

function crearRespuesta() {
    return {
        statusCode: null,
        contentType: null,
        filename: null,
        body: null,
        status(codigo) {
            this.statusCode = codigo;
            return this;
        },
        type(tipo) {
            this.contentType = tipo;
            return this;
        },
        attachment(nombre) {
            this.filename = nombre;
            return this;
        },
        send(contenido) {
            this.body = contenido;
            return this;
        },
        json(contenido) {
            this.body = contenido;
            return this;
        }
    };
}

test('la exportación entrega CSV y neutraliza fórmulas de hoja de cálculo', async () => {
    const controlador = new ExportarResenasControlador({
        async exportarResenasCSV(id) {
            assert.equal(id, 17);
            return [{
                nombreUsuario: '=HYPERLINK("https://example.com")',
                calificacion: 8,
                comentario: 'Texto, con "comillas"',
                fechaCreacion: '2026-11-05 12:00:00'
            }];
        }
    });
    const respuesta = crearRespuesta();
    let errorSiguiente;

    await controlador.exportarCSV(
        { params: { id: '17' } },
        respuesta,
        error => { errorSiguiente = error; }
    );

    assert.equal(errorSiguiente, undefined);
    assert.equal(respuesta.statusCode, 200);
    assert.equal(respuesta.contentType, 'text/csv');
    assert.equal(respuesta.filename, 'resenas-17.csv');
    assert.match(respuesta.body, /^\uFEFF/);
    assert.match(respuesta.body, /"'=HYPERLINK/);
    assert.match(respuesta.body, /"Texto, con ""comillas"""/);
});

test('la exportación responde 404 cuando no hay reseñas', async () => {
    const controlador = new ExportarResenasControlador({
        async exportarResenasCSV() { return []; }
    });
    const respuesta = crearRespuesta();

    await controlador.exportarCSV(
        { params: { id: '17' } },
        respuesta,
        error => { throw error; }
    );

    assert.equal(respuesta.statusCode, 404);
    assert.equal(respuesta.body.exito, false);
});

test('los errores de base de datos se envían al middleware central', async () => {
    const fallo = new Error('Fallo de prueba.');
    const controlador = new ExportarResenasControlador({
        async exportarResenasCSV() { throw fallo; }
    });
    const respuesta = crearRespuesta();
    let errorSiguiente;

    await controlador.exportarCSV(
        { params: { id: '17' } },
        respuesta,
        error => { errorSiguiente = error; }
    );

    assert.equal(errorSiguiente, fallo);
});
