'use strict';

const Controller = require('egg').Controller;

class ResidentController extends Controller {
    async residentList() {
        const { ctx } = this;
        const residentList = await ctx.service.block.getAllResidentsByUid(ctx.uid);
        ctx.body = {
            "code": 0,
            "msg": "",
            "count": residentList.length,
            "data": residentList
        };
        ctx.status = 200;
    }

    async sentFriendRequest() {
        const { ctx } = this;
        const result = await ctx.service.friend.friendRequest(ctx.uid, ctx.request.body.uid);
        ctx.body = {
            "code": 0
        }
        ctx.status = 200;
    }
    async addNeighbor() {
        const { ctx } = this;
        const result = await ctx.service.neighbor.addNeighbor(ctx.uid, ctx.request.body.uid);
        ctx.body = {
            "code": 0
        }
        ctx.status = 200;
    }
    async removeFriend() {
        const { ctx } = this;
        const result = await ctx.service.friend.removeFriend(ctx.uid, ctx.request.body.uid);
        ctx.body = {
            "code": 0
        }
        ctx.status = 200;
    }
    async removeNeighbor() {
        const { ctx } = this;
        const result = await ctx.service.neighbor.removeNeighbor(ctx.uid, ctx.request.body.uid);
        ctx.body = {
            "code": 0
        }
        ctx.status = 200;
    }
}

module.exports = ResidentController;
