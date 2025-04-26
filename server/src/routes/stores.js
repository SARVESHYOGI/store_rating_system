import express from 'express';
import { PrismaClient } from '@prisma/client';
import { validateStore } from '../middleware/validation.js';
import { authenticate, authorizeAdmin, authorizeStoreOwner } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res, next) => {
    try {
        const { name, address } = req.query;

        const whereCondition = {};

        if (name) whereCondition.name = { contains: name, mode: 'insensitive' };
        if (address) whereCondition.address = { contains: address, mode: 'insensitive' };

        const stores = await prisma.store.findMany({
            where: whereCondition,
            include: {
                owner: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                ratings: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        const storesWithRatings = stores.map(store => {
            const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

            const userRating = store.ratings.find(r => r.userId === req.user.id);

            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                owner: store.owner,
                averageRating: parseFloat(averageRating.toFixed(1)),
                totalRatings: store.ratings.length,
                userRating: userRating ? userRating.rating : null
            };
        });

        res.json(storesWithRatings);
    } catch (error) {
        next(error);
    }
});

router.post('/', authenticate, authorizeAdmin, validateStore, async (req, res, next) => {
    try {
        const { name, email, address, ownerId } = req.body;

        const owner = await prisma.user.findUnique({
            where: { id: ownerId }
        });

        if (!owner) {
            return res.status(404).json({ message: 'Store owner not found' });
        }

        if (owner.role !== 'STORE_OWNER') {
            await prisma.user.update({
                where: { id: ownerId },
                data: { role: 'STORE_OWNER' }
            });
        }

        const store = await prisma.store.create({
            data: {
                name,
                email,
                address,
                ownerId
            }
        });

        res.status(201).json(store);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const { id } = req.params;

        const store = await prisma.store.findUnique({
            where: { id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                ratings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

        const userRating = store.ratings.find(r => r.userId === req.user.id);

        const formattedStore = {
            ...store,
            averageRating: parseFloat(averageRating.toFixed(1)),
            totalRatings: store.ratings.length,
            userRating: userRating ? userRating.rating : null
        };

        res.json(formattedStore);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', authenticate, validateStore, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, address } = req.body;

        const store = await prisma.store.findUnique({
            where: { id }
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        if (req.user.role !== 'ADMIN' && store.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this store' });
        }

        const updatedStore = await prisma.store.update({
            where: { id },
            data: {
                name,
                email,
                address
            }
        });

        res.json(updatedStore);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;

        const store = await prisma.store.findUnique({
            where: { id }
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }
        await prisma.rating.deleteMany({
            where: { storeId: id }
        });
        await prisma.store.delete({
            where: { id }
        });

        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;