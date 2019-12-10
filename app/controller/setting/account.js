'use strict';

const Controller = require('egg').Controller;

class AccountController extends Controller {
  async detail() {

    const { ctx } = this;
    const user = await ctx.service.user.detail(ctx.uid);
    ctx.body = {
      code: 0,
      data: user[0]
    }
    ctx.status = 200;

  }
}

module.exports = AccountController;
