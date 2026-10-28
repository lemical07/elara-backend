import jwt from 'jsonwebtoken';
import pool from '../config/database.js';


export const verificarToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ 
            exito: false, 
            mensaje: 'Acceso denegado. Token de autenticación no proporcionado.' 
        });
    }

    try {
        const secreto = process.env.JWT_SECRET || 'secreto_elara_jwt';
        const decoded = jwt.verify(token, secreto);

        const [rows] = await pool.query(
            `SELECT u.id, u.correo, u.activo, r.nombre_rol 
             FROM usuario u 
             INNER JOIN rol r ON u.rol_id = r.id 
             WHERE u.id = ?`,
            [decoded.id]
        );
        if (rows.length === 0 || !rows[0].activo) {
            return res.status(401).json({ 
                exito: false, 
                mensaje: 'El usuario asociado al token no existe o se encuentra inactivo.' 
            });
        }
        req.usuario = rows[0];
        next();
    } catch (error) {
        return res.status(403).json({ 
            exito: false, 
            mensaje: 'Token inválido o expirado.', 
            error: error.message 
        });
    }
};

export const verificarAdmin = (req, res, next) => {
    if (!req.usuario || req.usuario.nombre_rol !== 'Administrador') {
        return res.status(403).json({ 
            exito: false, 
            mensaje: 'Acceso prohibido. Se requieren privilegios de Administrador.' 
        });
    }
    next();
};