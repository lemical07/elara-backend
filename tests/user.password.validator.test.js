import assert from 'node:assert/strict';
import test from 'node:test';
import { validationResult } from 'express-validator';
import UsuarioCambiarContrasenaValidaciones from '../src/validators/user.password.validator.js';

async function validar(datos) {
    const solicitud = { body: datos };
    for (const validador of UsuarioCambiarContrasenaValidaciones) {
        await validador.run(solicitud);
    }
    return validationResult(solicitud);
}

test('el cambio de contraseña requiere y valida la confirmación', async () => {
    const datos = {
        contrasena_actual: 'ClaveActual123',
        contrasena_nueva: 'ClaveNueva456',
        contrasena_nueva_confirmacion: 'ClaveNueva456'
    };

    assert.equal((await validar(datos)).isEmpty(), true);
    assert.equal((await validar({
        ...datos,
        contrasena_nueva_confirmacion: 'NoCoincide456'
    })).isEmpty(), false);
    assert.equal((await validar({
        contrasena_actual: datos.contrasena_actual,
        contrasena_nueva: datos.contrasena_nueva
    })).isEmpty(), false);
});
