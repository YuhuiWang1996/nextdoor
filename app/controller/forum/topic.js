'use strict';

const Controller = require('egg').Controller;

class TopicController extends Controller {
    async topicList() {

        const { ctx } = this;
        const result = await ctx.service.topic.getTopicListByUid(ctx.uid, ctx.query.page, ctx.query.limit);
        ctx.body = {
            "code": 0,
            "msg": "",
            "count": result.count,
            "data": result.topicList
        };
        ctx.status = 200;

    }

    async newTopic() {
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.topic.newTopic(ctx.uid, body.tsubject, body.recipient_uid, body.is_block,
             body.is_hood, body.is_friends, body.mtitle, body.mbody, body.mlat, body.mlng, body.maddr_name);
        ctx.body = {
            "code": 0,
            "data": {
                thid: ctx.thid,
                tid: ctx.tid
            }
        };
        ctx.status = 200;
    }

    async threadList() {
        const { ctx } = this;

        const threadList = await ctx.service.topic.getThreadListByTid(ctx.uid, ctx.query.tid);

        ctx.body = {
            "code": 0,
            "msg": "",
            "count": threadList.length,
            "data": threadList
        };
        ctx.status = 200;
    }

    async topicDetail() {
        const { ctx } = this;

        const detail = await ctx.service.topic.getTopicDetail(ctx.query.tid);

        ctx.body = {
            "code": 0,
            "data": detail,
        };
        ctx.status = 200;
    }

    async friendAndNeighborList() {
        const { ctx } = this;
        const friendAndNeighborList = await ctx.service.topic.getFriendAndNeighborListByUid(ctx.uid);

        ctx.body = {
            "code": 0,
            "data": friendAndNeighborList,
        }
        ctx.status = 200;
    }

    async receiverList() {
        const { ctx } = this;
        const receiverList = await ctx.service.topic.getReceiverListByTid(ctx.query.tid, ctx.uid);

        ctx.body = {
            "code": 0,
            "data": {
                receiverList: receiverList
            }
        }
        ctx.status = 200;

    }

}

module.exports = TopicController;
