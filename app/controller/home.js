'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('index.html');
  }

  async userinfo() {
    const { ctx } = this;
    const user = await ctx.service.user.detail(ctx.uid);
    ctx.body = {
      code: 0,
      data: user[0]
    }
    ctx.status = 200;
  }
}

module.exports = HomeController;
