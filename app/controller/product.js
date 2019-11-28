'use strict';

const Controller = require('egg').Controller;

class ProductController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'product';
  }

  async detail() {
    const { ctx } = this;
    ctx.body = 'info';
  }
}

module.exports = ProductController;
