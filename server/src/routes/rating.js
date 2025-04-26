import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateRating } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authenticate, validateRating, async (req, res, next) => {
    try {
        const { storeId, rating } = req.body;
        const userId = req.user.id;

        const store = await prisma.store.findUnique({
            where: { id: storeId }
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        if (store.ownerId === userId) {
            return res.status(403).json({ message: 'You cannot rate your own store' });
        }

        const existingRating = await prisma.rating.findUnique({
            where: {
                userId_storeId: {
                    userId,
                    storeId
                }
            }
        });

        let result;

        if (existingRating) {
            result = await prisma.rating.update({
                where: {
                    userId_storeId: {
                        userId,
                        storeId
                    }
                },
                data: {
                    rating
                }
            });

            res.json({
                message: 'Rating updated successfully',
                rating: result
            });
        } else {
            result = await prisma.rating.create({
                data: {
                    rating,
                    userId,
                    storeId
                }
            });

            res.status(201).json({
                message: 'Rating submitted successfully',
                rating: result
            });
        }
    } catch (error) {
        next(error);
    }
});

router.get('/store/:storeId', authenticate, async (req, res, next) => {
    try {
        const { storeId } = req.params;

        const store = await prisma.store.findUnique({
            where: { id: storeId }
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const ratings = await prisma.rating.findMany({
            where: { storeId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(ratings);
    } catch (error) {
        next(error);
    }
});

router.get('/user/:userId', authenticate, async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
            return res.status(403).json({ message: 'Not authorized to view these ratings' });
        }

        const ratings = await prisma.rating.findMany({
            where: { userId },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        address: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(ratings);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const rating = await prisma.rating.findUnique({
            where: { id }
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        if (req.user.role !== 'ADMIN' && rating.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this rating' });
        }

        await prisma.rating.delete({
            where: { id }
        });

        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;