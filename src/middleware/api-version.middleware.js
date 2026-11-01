import semver from 'semver';
import packageJson from '../../package.json' with { type: 'json' };

const rangoVersionSoportado = `^${packageJson.version}`;

export function validarVersionAPI(req, res, next) {
    const versionSolicitada = req.get('X-API-Version') || packageJson.version;

    if (!semver.valid(versionSolicitada)) {
        return res.status(400).json({
            exito: false,
            mensaje: 'El encabezado X-API-Version debe contener una versión semver válida.'
        });
    }

    if (!semver.satisfies(versionSolicitada, rangoVersionSoportado)) {
        return res.status(406).json({
            exito: false,
            mensaje: `La versión solicitada no es compatible. Versión actual: ${packageJson.version}.`
        });
    }

    res.set('X-API-Version', packageJson.version);
    return next();
}
