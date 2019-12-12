'use strict';

const Controller = require('egg').Controller;

class ThreadController extends Controller {
    async new() {
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.thread.create(ctx.uid, body.tid, body.mtitle, body.mbody, body.receiver_uids, body.mlat, body.mlng, body.maddr_name);

        ctx.body = {
            "code": 0,
            "data": {
                thid: ctx.thid
            }
        }
        ctx.status = 200;

    }
    async unreadThreadList() {

        const { ctx } = this;

        const result = await ctx.service.thread.getUnreadThreadListByUid(ctx.uid, ctx.query.page, ctx.query.limit);

        ctx.body = {
            "code": 0,
            "msg": "",
            "count": result.count,
            "data": result.threadList
        };
        ctx.status = 200;

    }

    async getAllThreadList() {
        const {ctx} = this;
        const result = await ctx.service.thread.getAllThreadListByUid(ctx.uid, ctx.query.type, ctx.query.page, ctx.query.limit);
        ctx.body = {
            "code": 0,
            "msg": "",
            "count": result.count,
            "data": result.threadList
        };
        ctx.status = 200;
    }
}

module.exports = ThreadController;
