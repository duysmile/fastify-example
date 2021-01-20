const fastify = require('fastify')({
    logger: true,
    ignoreTrailingSlash: true,
});
const fastifyMongoose = require('./plugins/fastify-mongoose');

const helloRoute = require('./routes/hello.route');

fastify.register(fastifyMongoose, {
    uri: "mongodb://localhost:27017/fastify",
});
fastify.register(helloRoute);

fastify.setErrorHandler(function (error, request, reply) {
    // Log error
    this.log.error(error);
    // Send error response
    reply.status(409).send({ ok: false });
});

const start = async () => {
    try {
        await fastify.ready();
        await fastify.listen(3000);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

start();
