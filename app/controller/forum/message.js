'use strict';

const Controller = require('egg').Controller;

class MessageController extends Controller {

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

        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.message.replyMessage(body.thid, ctx.uid, body.mtitle, body.mbody, body.mlat, body.mlng, body.maddr_name);

        ctx.body = {
            "code": 0
        }
        ctx.status = 200;

    }
}

module.exports = MessageController;
