import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { validateUser } from '../middleware/validation.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const { name, email, address, role } = req.query;

        const whereCondition = {};

        if (name) whereCondition.name = { contains: name, mode: 'insensitive' };
        if (email) whereCondition.email = { contains: email, mode: 'insensitive' };
        if (address) whereCondition.address = { contains: address, mode: 'insensitive' };
        if (role) whereCondition.role = role;

        const users = await prisma.user.findMany({
            where: whereCondition,
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(users);
    } catch (error) {
        next(error);
    }
});

router.post('/', authenticate, authorizeAdmin, validateUser, async (req, res, next) => {
    try {
        const { name, email, password, address, role } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                address,
                role: role || 'USER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
            }
        });

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'STORE_OWNER') {
            const store = await prisma.store.findFirst({
                where: { ownerId: id },
                include: {
                    ratings: true
                }
            });

            if (store && store.ratings.length > 0) {
                const totalRating = store.ratings.reduce((sum, rating) => sum + rating.rating, 0);
                user.averageRating = totalRating / store.ratings.length;
            } else {
                user.averageRating = 0;
            }
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authenticate, authorizeAdmin, validateUser, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, address, role } = req.body;

        const userExists = await prisma.user.findUnique({
            where: { id }
        });

        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                email,
                address,
                role
            },
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;