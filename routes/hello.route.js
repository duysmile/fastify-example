async function routes(fastify, options) {
    fastify.route({
        method: 'GET',
        url: '/',
        schema: {
            queryString: {
                name: { type: 'string' },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        hello: { type: 'string' },
                    },
                },
            },
        },
        handler: async (req, res) => {
            return res.send({ hello: 'world' });
        },
    });
}

module.exports = routes;
