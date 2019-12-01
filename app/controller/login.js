'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
    async login() {
        const { ctx, app } = this;
        const result = await ctx.service.user.login(ctx.request.body.email, ctx.request.body.pwd);
        if (result.status) {
            ctx.body = {
                code: 0,
                data: {
                    access_token: app.jwt.sign({
                        uid: result.uid
                    }, app.config.jwt.secret, { expiresIn: '10h' })
                }
            }
            ctx.status = 200;
        } else {
            ctx.body = {
                code: 4010,
                msg: result.msg
            }
            ctx.status = 401;
        }
    }
}

module.exports = LoginController;
