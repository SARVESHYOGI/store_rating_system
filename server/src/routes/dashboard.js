import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorizeAdmin, authorizeStoreOwner } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/admin', authenticate, authorizeAdmin, async (req, res, next) => {
    try {
        const [userCount, storeCount, ratingCount] = await Promise.all([
            prisma.user.count(),
            prisma.store.count(),
            prisma.rating.count()
        ]);

        const usersByRole = await prisma.user.groupBy({
            by: ['role'],
            _count: {
                role: true
            }
        });

        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        const recentStores = await prisma.store.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                owner: {
                    select: {
                        name: true
                    }
                },
                ratings: true
            }
        });

        const formattedStores = recentStores.map(store => {
            const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

            return {
                id: store.id,
                name: store.name,
                ownerName: store.owner.name,
                createdAt: store.createdAt,
                averageRating: parseFloat(averageRating.toFixed(1)),
                totalRatings: store.ratings.length
            };
        });

        const recentRatings = await prisma.rating.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                store: {
                    select: {
                        name: true
                    }
                }
            }
        });

        res.json({
            counts: {
                users: userCount,
                stores: storeCount,
                ratings: ratingCount
            },
            usersByRole: usersByRole.reduce((acc, item) => {
                acc[item.role] = item._count.role;
                return acc;
            }, {}),
            recentUsers,
            recentStores: formattedStores,
            recentRatings
        });
    } catch (error) {
        next(error);
    }
});

router.get('/store-owner', authenticate, authorizeStoreOwner, async (req, res, next) => {
    try {
        const userId = req.user.id;

        const stores = await prisma.store.findMany({
            where: {
                ownerId: userId
            },
            include: {
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

        if (stores.length === 0) {
            return res.status(404).json({ message: 'No stores found for this owner' });
        }

        const storesData = stores.map(store => {
            const totalRating = store.ratings.reduce((sum, r) => sum + r.rating, 0);
            const averageRating = store.ratings.length > 0 ? totalRating / store.ratings.length : 0;

            const ratingDistribution = {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0
            };

            store.ratings.forEach(r => {
                ratingDistribution[r.rating]++;
            });

            const formattedRatings = store.ratings.map(r => ({
                id: r.id,
                rating: r.rating,
                createdAt: r.createdAt,
                updatedAt: r.updatedAt,
                user: r.user
            }));

            return {
                id: store.id,
                name: store.name,
                email: store.email,
                address: store.address,
                totalRatings: store.ratings.length,
                averageRating: parseFloat(averageRating.toFixed(1)),
                ratingDistribution,
                ratings: formattedRatings
            };
        });

        const allStoreIds = stores.map(store => store.id);

        const recentRatings = await prisma.rating.findMany({
            where: {
                storeId: {
                    in: allStoreIds
                }
            },
            take: 10,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                store: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.json({
            stores: storesData,
            recentRatings
        });
    } catch (error) {
        next(error);
    }
});

export default router;