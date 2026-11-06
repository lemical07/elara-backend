import semver from 'semver';
import packageJson from '../../package.json' with { type: 'json' };

const rangoVersionSoportado = `^${packageJson.version}`;

class VersionAPIMiddleware {
    static validar(req, res, next) {
        const versionSolicitada = req.get('X-API-Version') || packageJson.version;

        if (!semver.satisfies(versionSolicitada, rangoVersionSoportado)) {
            return res.status(406).json({
                exito: false,
                mensaje: `La versión solicitada no es compatible. Versión actual: ${packageJson.version}.`
            });
        }

        res.set('X-API-Version', packageJson.version);
        return next();
    }
}

export const validarVersionAPI = VersionAPIMiddleware.validar;
