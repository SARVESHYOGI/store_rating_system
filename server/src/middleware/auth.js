import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Authentication token missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }

        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        };

        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};

export const authorizeStoreOwner = (req, res, next) => {
    if (req.user.role !== 'STORE_OWNER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied. Store owner privileges required.' });
    }
    next();
};