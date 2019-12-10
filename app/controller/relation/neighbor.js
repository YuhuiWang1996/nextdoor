'use strict';

const Controller = require('egg').Controller;

class NeighborController extends Controller {
    async neighborList() {

        const { ctx } = this;
        const neighborList = await ctx.service.neighbor.getNeighborListByUid(ctx.uid);
        ctx.body = {
            code: 0,
            data: neighborList
        }
        ctx.status = 200;

    }
}

module.exports = NeighborController;
