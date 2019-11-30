'use strict';

const Service = require('egg').Service;

class BlockService extends Service {
  async getBlockListLikeName(name) {
    const { app } = this;
    const blockList = await app.mysql.query(
      'SELECT bid, bname, hname FROM Block NATURAL JOIN Hood \
      WHERE bname LIKE ?', ['%' + name + '%']);
    return blockList;
  }
}

module.exports = BlockService;
