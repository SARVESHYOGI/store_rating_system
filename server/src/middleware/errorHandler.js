export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.code) {
        switch (err.code) {
            case 'P2002':
                return res.status(409).json({
                    message: 'Resource already exists with this unique constraint',
                    field: err.meta?.target?.[0]
                });
            case 'P2025':
                return res.status(404).json({
                    message: 'Resource not found',
                });
            default:
                return res.status(500).json({
                    message: 'Database error',
                    code: err.code
                });
        }
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong on the server';

    return res.status(statusCode).json({ message });
};