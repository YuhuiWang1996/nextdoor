'use strict';

const Controller = require('egg').Controller;

class TopicController extends Controller {
    async topicList() {

        const { ctx } = this;

        const topicList = await ctx.service.topic.getTopicListByUid(ctx.uid);

        ctx.body = {
            "code": 0,
            "msg": "",
            "count": topicList.length,
            "data": topicList
        };
        ctx.status = 200;

    }

    async newTopic() {
        const { ctx } = this;
        const body = ctx.request.body;
        const result = await ctx.service.topic.newTopic(ctx.uid, body.tsubject, body.recipient_uid, body.is_block, body.is_hood, body.is_friends, body.mtitle, body.mbody);
        ctx.body = {
            "code": 0
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

}

module.exports = TopicController;
