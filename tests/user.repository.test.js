import assert from 'node:assert/strict';
import test from 'node:test';
import { UsuarioRepositorio } from '../src/repositories/user.repository.js';

function crearRepositorioConexion({
    lockResult = 1,
    usuarioActivo = true,
    administradores = [{ id: 1 }],
    rollbackFails = false,
    nombreRolActual = 'Administrador'
} = {}) {
    const llamadas = [];
    const ejecuciones = [];
    const conexion = {
        async execute(sql, valores = []) {
            llamadas.push(sql);
            ejecuciones.push({ sql, valores });
            if (sql.includes('GET_LOCK')) return [[{ adquirido: lockResult }]];
            if (sql.includes('RELEASE_LOCK')) return [[{ liberado: 1 }]];
            if (sql.includes('FROM rol')) {
                return [[{
                    id: valores[0].toLowerCase() === 'administrador' ? 1 : 2,
                    nombre_rol: valores[0]
                }]];
            }
            if (sql.includes('WHERE u.id = ?') && sql.includes('FOR UPDATE')) {
                return [[{
                    id: 1,
                    rol_id: nombreRolActual === 'Administrador' ? 1 : 2,
                    activo: usuarioActivo,
                    nombre_rol: nombreRolActual
                }]];
            }
            if (sql.includes('WHERE u.activo = TRUE')) return [administradores];
            if (sql.includes('UPDATE usuario SET rol_id')) return [{ affectedRows: 1 }];
            return [[]];
        },
        async beginTransaction() { llamadas.push('BEGIN'); },
        async commit() { llamadas.push('COMMIT'); },
        async rollback() {
            llamadas.push('ROLLBACK');
            if (rollbackFails) throw new Error('Fallo de rollback de prueba.');
        },
        release() { llamadas.push('RELEASE_CONNECTION'); },
        destroy() { llamadas.push('DESTROY_CONNECTION'); }
    };
    const repositorio = new UsuarioRepositorio({
        async getConnection() { return conexion; }
    });
    return { repositorio, llamadas, ejecuciones };
}

test('el bloqueo asesor confirma la transacción y libera la conexión', async () => {
    const { repositorio, llamadas } = crearRepositorioConexion();
    const resultado = await repositorio.registrarAtomico(async () => 'confirmado');

    assert.equal(resultado, 'confirmado');
    assert.deepEqual(llamadas, [
        'SELECT GET_LOCK(?, 10) AS adquirido',
        'BEGIN',
        'COMMIT',
        'SELECT RELEASE_LOCK(?) AS liberado',
        'RELEASE_CONNECTION'
    ]);
});

test('un fallo en la operación ejecuta rollback y no confirma', async () => {
    const { repositorio, llamadas } = crearRepositorioConexion();
    const fallo = new Error('Fallo de prueba.');

    await assert.rejects(repositorio.registrarAtomico(async () => { throw fallo; }), fallo);
    assert.equal(llamadas.includes('ROLLBACK'), true);
    assert.equal(llamadas.includes('COMMIT'), false);
    assert.equal(llamadas.includes('SELECT RELEASE_LOCK(?) AS liberado'), true);
});

test('un timeout del bloqueo impide iniciar la transacción', async () => {
    const { repositorio, llamadas } = crearRepositorioConexion({ lockResult: 0 });

    await assert.rejects(
        repositorio.registrarAtomico(async () => 'no debe ejecutarse'),
        error => error.status === 503
    );
    assert.equal(llamadas.includes('BEGIN'), false);
    assert.equal(llamadas.includes('RELEASE_CONNECTION'), true);
});

test('una conexión cuyo rollback falla se destruye en vez de volver al pool', async () => {
    const { repositorio, llamadas } = crearRepositorioConexion({ rollbackFails: true });

    await assert.rejects(repositorio.registrarAtomico(async () => {
        throw new Error('Fallo de operación de prueba.');
    }));
    assert.equal(llamadas.includes('DESTROY_CONNECTION'), true);
    assert.equal(llamadas.includes('RELEASE_CONNECTION'), false);
    assert.equal(llamadas.includes('SELECT RELEASE_LOCK(?) AS liberado'), false);
});

test('no se puede retirar el rol del último administrador activo', async () => {
    const { repositorio, llamadas } = crearRepositorioConexion();

    await assert.rejects(
        repositorio.actualizarRol(1, 'USUARIO'),
        error => error.status === 409
    );
    assert.equal(llamadas.includes('UPDATE usuario SET rol_id = ? WHERE id = ?'), false);
    assert.equal(llamadas.includes('ROLLBACK'), true);
});

test('un administrador puede promover una cuenta normal sin cambiar otros datos', async () => {
    const { repositorio, llamadas, ejecuciones } = crearRepositorioConexion({
        nombreRolActual: 'Usuario'
    });

    await repositorio.actualizarRol(1, 'ADMIN');
    const actualizacion = ejecuciones.find(
        ejecucion => ejecucion.sql === 'UPDATE usuario SET rol_id = ? WHERE id = ?'
    );

    assert.ok(actualizacion);
    assert.deepEqual(actualizacion.valores, [1, 1]);
    assert.equal(llamadas.includes('COMMIT'), true);
});
