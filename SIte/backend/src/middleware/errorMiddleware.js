function errorMiddleware(error, req, res, next) {
    console.error(error);

    const status = error.status || 500;
    const message = error.message || 'Erro interno do servidor';

    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
}

module.exports = { errorMiddleware };