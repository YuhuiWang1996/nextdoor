const jwt = require('jsonwebtoken');

module.exports = options => {
    return async function auz(ctx, next) {
        let secret = options.secret;
        let url = ctx.url;
        let access_token;
        if (ctx.header.access_token) {
            access_token = ctx.header.access_token;
        } else {
            if (ctx.method === "GET") {
                access_token = ctx.request.query.access_token;
            } else {
                access_token = ctx.request.body.access_token;
            }
        }
        if (access_token) {
            try {
                const { uid, iat, exp } = jwt.verify(access_token, secret);
                ctx.uid = uid;
            } catch (err) {
                ctx.status = 401;
                return ctx.body = {
                    code: 4010,
                    msg: 'Please sign in again.',
                    data: {
                        redirect: url
                    }
                };
            }
        }
        await next();
    }
}