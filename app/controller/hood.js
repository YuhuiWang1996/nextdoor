'use strict';

const Controller = require('egg').Controller;

class HoodController extends Controller {
    async residentList() {
        const { ctx } = this;
        const blockList = await ctx.service.hood.getAllResidentsByUid(ctx.uid);
        ctx.body = {
            "code": 0,
            "msg": "",
            "count": blockList.length,
            "data": blockList
        };
        ctx.status = 200;
    }
}

module.exports = HoodController;
