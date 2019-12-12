'use strict';

const Controller = require('egg').Controller;


class BlockController extends Controller {
    async blockList() {
        const {ctx} = this;
        const blockList = await ctx.service.block.getBlockList();
        ctx.body = {
            code: 0,
            data: blockList
        };
        ctx.status = 200;
    }

    async hoodList() {
        const {ctx} = this;
        const hoodList = await ctx.service.hood.getHoodList();
        ctx.body = {
            code: 0,
            data: hoodList
        }
        ctx.status = 200;
    }

    async changeBlock() {
        const { ctx } = this;
        const body = ctx.request.body;
        await ctx.service.user.changeBlock(ctx.uid, body.bid, body.uaddr_lat, body.uaddr_lng, body.uaddr_name);
        ctx.body = {
            code: 0
        }
        ctx.status = 200;
    }
}

module.exports = BlockController;
