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
        ctx.status = 200;
    }

    async friendRequests() {
        const { ctx } = this;
        const friendList = await ctx.service.friend.getFriendRequestsListByUid(ctx.uid);
        ctx.body = {
            code: 0,
            data: friendList
        }
        ctx.status = 200;
    }

    async requestsSent() {
        const { ctx } = this;
        const friendList = await ctx.service.friend.getRequestsSentListByUid(ctx.uid);
        ctx.body = {
            code: 0,
            data: friendList
        }
        ctx.status = 200;
    }

    async friendList() {
        const { ctx } = this;
        const friendList = await ctx.service.friend.getFriendListByUid(ctx.uid);
        ctx.body = {
            code: 0,
            data: friendList
        }
        ctx.status = 200;
    }

    async removeFriend() {
        const { ctx } = this;
        const result = await ctx.service.friend.removeFriend(ctx.uid, ctx.request.body.recipient_uid);
        ctx.body = {
            code: 0
        }
        ctx.status = 200;
    }

    async acceptFriendRequest() {
        const { ctx } = this;
        const result = await ctx.service.friend.friendRequest(ctx.uid, ctx.request.body.recipient_uid);
        ctx.body = {
            code: 0
        }
        ctx.status = 200;
    }

    async potentialFriendList() {
        const { ctx } = this;
        const friendList = await ctx.service.friend.getPotentialFriendListByUid(ctx.uid);
        ctx.body = {
            "code": 0,
            "msg": "",
            "count": friendList.length,
            "data": friendList
        };
        ctx.status = 200;
    }
}

module.exports = FriendController;
