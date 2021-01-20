const fp = require('fastify-plugin');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

function fastifyMongoose(fastify, options, next) {
    const {
        uri,
        name,
        options: mongooseOpts,
    } = options;
    if (!uri) {
        next(new Error('`uri` is required parameter.'));
        return;
    }

    const opts = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ...mongooseOpts,
    };

    mongoose.connect(uri, opts).then(db => {
        db.now('error', error => {
            fastify.log.error(error, 'Mongoose connection error');
        });

        fastify.addHook('onClose', (_, done) => {
            db.close(done);
        });

        const mongo = {
            db,
            ObjectId,
        };

        if ((fastify.mongo && !name)
            || (fastify.mongo && fastify.mongo[name])
        ) {
            next(new Error(`Fastify mongoose has been already registered.`));
            return;
        }

        if (!fastify.mongo) {
            fastify.decorate('mongo', mongo);
        }

        if (name) {
            fastify.mongo[name] = mongo;
        }

        next();
    }).catch(err => {
        fastify.log.error(err, 'Error connecting mongoDB.');
        next(err);
    });
}

module.exports = fp(fastifyMongoose, {
    fastify: '3.x',
    name: 'fastify-mongoose',
});
