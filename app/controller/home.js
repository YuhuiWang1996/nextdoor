'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    const res = await app.mysql.select('station');
    await ctx.render('index.ejs', { id: 100 });
  }
}

module.exports = HomeController;
