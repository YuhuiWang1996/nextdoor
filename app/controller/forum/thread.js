'use strict';

const Controller = require('egg').Controller;

class ThreadController extends Controller {
    async new() {
        const { ctx } = this;
        const result = await ctx.service.thread.create(ctx.uid, ctx.request.body.tid, ctx.request.body.mtitle, ctx.request.body.mbody, ctx.request.body.receiver_uids);

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

        const threadList = await ctx.service.thread.getUnreadThreadListByUid(ctx.uid);

        ctx.body = {
            "code": 0,
            "msg": "",
            "count": threadList.length,
            "data": threadList
        };
        ctx.status = 200;

    }
}

module.exports = ThreadController;
