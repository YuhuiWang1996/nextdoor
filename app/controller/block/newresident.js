'use strict';

const Controller = require('egg').Controller;

class NewresidentController extends Controller {
    async newResidentList() {
        const { ctx } = this;
        const newResidentList = await ctx.service.block.getBlockNewResidentListByUid(ctx.uid);
        ctx.body = {
            "code": 0,
            "msg": "",
            "count": newResidentList.length,
            "data": newResidentList
        };
        ctx.status = 200;
    }

    async approve() {
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.block.approveBlockJoin(body.applicant_uid, ctx.uid, body.bid, body.applyAt);
        ctx.body = {
            code: 0
        };
        ctx.status = 200;
    }
}

module.exports = NewresidentController;
