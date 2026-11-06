import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import test from 'node:test';
import { validationResult } from 'express-validator';
import AutenticacionServicio from '../src/services/auth.service.js';
import { RegistroValidaciones } from '../src/validators/auth.validator.js';

class RepositorioEnMemoria {
    constructor() {
        this.usuarios = [];
        this.colaRegistro = Promise.resolve();
        this.fallarAlCrear = false;
    }

    registrarAtomico(operacion) {
        const tarea = this.colaRegistro.then(async () => {
            const usuariosPrevios = [...this.usuarios];
            try {
                return await operacion({
                    execute: async () => [[{ total: this.usuarios.length }]]
                });
            } catch (error) {
                this.usuarios = usuariosPrevios;
                throw error;
            }
        });
        this.colaRegistro = tarea.then(() => undefined, () => undefined);
        return tarea;
    }

    async buscarPorCorreo(correo) {
        return this.usuarios.find(usuario => usuario.correo === correo) ?? null;
    }

    async buscarRolPorNombre(nombre) {
        return {
            id: nombre === 'Administrador' ? 1 : 2,
            nombre_rol: nombre
        };
    }

    async crear(datos) {
        if (this.fallarAlCrear) {
            throw new Error('Fallo de prueba al insertar.');
        }
        const usuario = { id: this.usuarios.length + 1, ...datos };
        this.usuarios.push(usuario);
        return usuario;
    }

    async buscarPorIdConRol(id) {
        const usuario = this.usuarios.find(item => item.id === id);
        if (!usuario) return null;
        return {
            ...usuario,
            activo: true,
            nombre_rol: usuario.rol_id === 1 ? 'Administrador' : 'Usuario'
        };
    }
}

function crearServicio(repositorio, contrasena = 'Aa2!xY7#kP4_m') {
    const servicio = new AutenticacionServicio(repositorio, () => contrasena);
    servicio.crearToken = () => 'token-de-prueba';
    return servicio;
}

async function validarRegistro(datos) {
    const solicitud = { body: datos };
    for (const validador of RegistroValidaciones) {
        await validador.run(solicitud);
    }
    return validationResult(solicitud);
}

const datosBase = (correo, adicionales = {}) => ({
    nombre: 'Ada',
    apellido: 'Lovelace',
    correo,
    ...adicionales
});

test('el primer registro crea un administrador y entrega una clave temporal de 13 caracteres una sola vez', async () => {
    const repositorio = new RepositorioEnMemoria();
    const resultado = await crearServicio(repositorio).registrar(datosBase('ada@example.com'));
    const usuarioGuardado = repositorio.usuarios[0];

    assert.equal(resultado.primer_administrador, true);
    assert.equal(resultado.usuario.rol, 'Administrador');
    assert.match(resultado.contrasena_temporal, /[A-HJ-NP-Z]/);
    assert.match(resultado.contrasena_temporal, /[a-km-np-z]/);
    assert.match(resultado.contrasena_temporal, /[2-9]/);
    assert.match(resultado.contrasena_temporal, /[!@#$%&*+\-_=]/);
    assert.equal(resultado.contrasena_temporal.length, 13);
    assert.notEqual(usuarioGuardado.contrasena, resultado.contrasena_temporal);
    assert.equal(await bcrypt.compare(resultado.contrasena_temporal, usuarioGuardado.contrasena), true);
    assert.equal(Object.hasOwn(usuarioGuardado, 'contrasena_temporal'), false);
    assert.equal(Object.hasOwn(resultado.usuario, 'contrasena'), false);
});

test('un registro posterior recibe solo el rol Usuario y requiere contraseña', async () => {
    const repositorio = new RepositorioEnMemoria();
    const servicio = crearServicio(repositorio);
    await servicio.registrar(datosBase('ada@example.com'));

    await assert.rejects(
        servicio.registrar(datosBase('grace@example.com')),
        error => error.status === 400
    );
    const resultado = await servicio.registrar(datosBase('grace@example.com', {
        contrasena: 'UnaClaveSegura123',
        rol: 'Administrador'
    }));

    assert.equal(resultado.usuario.rol, 'Usuario');
    assert.equal(Object.hasOwn(resultado, 'contrasena_temporal'), false);
});

test('el registro inicial rechaza contraseñas aportadas y el rol no es un campo permitido', async () => {
    const repositorio = new RepositorioEnMemoria();
    const servicio = crearServicio(repositorio);
    const errorValidacion = await validarRegistro(datosBase('ada@example.com', { rol: 'ADMIN' }));

    assert.equal(errorValidacion.isEmpty(), false);
    await assert.rejects(
        servicio.registrar(datosBase('ada@example.com', { contrasena: 'UnaClaveSegura123' })),
        error => error.status === 400
    );
    assert.equal(repositorio.usuarios.length, 0);
    assert.equal((await validarRegistro(datosBase('ada@example.com'))).isEmpty(), true);
});

test('dos registros simultáneos no crean dos primeros administradores', async () => {
    const repositorio = new RepositorioEnMemoria();
    const servicio = crearServicio(repositorio);
    const resultados = await Promise.allSettled([
        servicio.registrar(datosBase('ada@example.com')),
        servicio.registrar(datosBase('grace@example.com'))
    ]);

    assert.equal(resultados.filter(resultado => resultado.status === 'fulfilled').length, 1);
    assert.equal(repositorio.usuarios.filter(usuario => usuario.rol_id === 1).length, 1);
    assert.equal(repositorio.usuarios.length, 1);
});

test('un fallo de inserción no conserva una cuenta ni devuelve la clave temporal', async () => {
    const repositorio = new RepositorioEnMemoria();
    repositorio.fallarAlCrear = true;
    const servicio = crearServicio(repositorio);

    await assert.rejects(servicio.registrar(datosBase('ada@example.com')));
    assert.equal(repositorio.usuarios.length, 0);
});
