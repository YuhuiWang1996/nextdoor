'use strict';

const Controller = require('egg').Controller;

class FriendController extends Controller {
    async friendList() {

        const { ctx } = this;

        const friendList = await ctx.service.friend.getFriendListByUid(ctx.uid);

        ctx.body = {
            code: 0,
            data: friendList
        }

    }
}

module.exports = FriendController;
