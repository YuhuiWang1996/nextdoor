'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {

    async threadList() {

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

    async messageList() {

        const { ctx } = this;

        let messageList = await ctx.service.message.getMessageListByThid(ctx.query.thid, ctx.uid);

        if (messageList.length > 0) {
            const initialMsg = messageList[messageList.length - 1];
            messageList = messageList.slice(0, messageList.length - 1);
            messageList.unshift(initialMsg);
        }

        ctx.body = {
            "code": 0,
            "msg": "",
            "count": messageList.length,
            "data": messageList
        };
        ctx.status = 200;

    }

    async reply() {

        const {ctx} = this;
        let result = await ctx.service.message.replyMessage(ctx.request.body.thid, ctx.uid, ctx.request.body.mtitle, ctx.request.body.mbody);

        ctx.body = {
            "code": 0
        }
        ctx.status = 200;

    }
}

module.exports = MessageController;
