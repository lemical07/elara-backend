import { header } from 'express-validator';
import semver from 'semver';

export const VersionAPIValidaciones = [
    header('X-API-Version')
        .optional()
        .custom(version => semver.valid(version) !== null)
        .withMessage('El encabezado X-API-Version debe contener una versión semver válida.')
];
