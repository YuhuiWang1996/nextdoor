'use strict';

const Controller = require('egg').Controller;

class PasswordController extends Controller {
    async edit() {
        const { ctx } = this;
        const result = await ctx.service.user.changePassword(ctx.uid, ctx.request.body.upwd, ctx.request.body.newpwd);
        if (result) {
            ctx.body = {
                code: 0
            }
        } else {
            ctx.body = {
                code: 1,
                msg: 'Please Enter Correct Old Password'
            }
        }
        ctx.status = 200;
    }
}

module.exports = PasswordController;
