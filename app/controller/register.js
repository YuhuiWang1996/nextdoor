'use strict';

const Controller = require('egg').Controller;

class RegisterController extends Controller {
  async blockList() {
    const { ctx } = this;
    const blockList = await ctx.service.block.getBlockListLikeName(ctx.request.body.name);
    ctx.body = {
      blockList: blockList
    };
    ctx.status = 200;
  }

  async register() {
    const { ctx } = this;
    const rule = {
      firstname: { type: 'string' },
      lastname: { type: 'string' },
      // email: {type: 'string'},
      // pwd: {type: 'string'},
      // gender: {type: 'string'},
      // intro: {type: 'string'},
      // addr: {type: 'string'},
    };
    // ctx.validate(rule);
    const body = ctx.request.body;
    const result = await ctx.service.user.register(body.firstname, body.lastname, body.email, body.pwd, body.gender, body.intro, body.bid, body.uaddr_lat, body.uaddr_lng, body.uaddr_name);
    ctx.body = {
      code: 0
    };
    ctx.status = 201;

  }

}

module.exports = RegisterController;
