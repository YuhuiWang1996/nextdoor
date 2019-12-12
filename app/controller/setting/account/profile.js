'use strict';

const Controller = require('egg').Controller;

class ProfileController extends Controller {
    async accountDetail() {
        const { ctx } = this;
        const data = await ctx.service.user.detail(ctx.uid);
        ctx.body = {
            code: 0,
            data: data[0]
        };
        ctx.status = 200;
    }

    async edit() {
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.user.changeInfo(ctx.uid, body.ufirstname, body.ulastname, body.uemail, body.uintro);
        ctx.body = {
            code: 0
        };
        ctx.status = 200;
    }

}

module.exports = ProfileController;
