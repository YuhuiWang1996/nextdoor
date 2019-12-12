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

    async removeNeighbor() {
        const { ctx } = this;
        const result = await ctx.service.neighbor.removeNeighbor(ctx.uid, ctx.request.body.recipient_uid);
        ctx.body = {
            code: 0
        }
        ctx.status = 200;
    }

    async addNeighbor() {
        const { ctx } = this;
        const result = await ctx.service.neighbor.addNeighbor(ctx.uid, ctx.request.body.recipient_uid);
        ctx.body = {
            code: 0
        }
        ctx.status = 200;
    }

    async potentialNeighborList() {
        const { ctx } = this;
        const neighborList = await ctx.service.neighbor.getPotentialNeighborListByUid(ctx.uid);
        ctx.body = {
            "code": 0,
            "msg": "",
            "count": neighborList.length,
            "data": neighborList
        };
        ctx.status = 200;
    }
}

module.exports = NeighborController;
