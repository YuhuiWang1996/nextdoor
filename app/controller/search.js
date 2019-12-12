'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {
    async search() {
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.message.searchMessage(ctx.uid, body.mcontent, body.mlat, body.mlng, body.radius);
        ctx.body = {
            code: 0,
            data: result
        };
        ctx.status = 200;
    }
}

module.exports = SearchController;
