'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class MessageService extends Service {
  async getMessageListByUid(uid) {

    const { app } = this;

  }

  async getMessageListByThid(thid, uid) {
    const { app } = this;
    const messageList = await app.mysql.query(
      'SELECT * FROM Message AS M NATURAL JOIN `User` AS U WHERE thid = ? ORDER BY createAt DESC', [thid]
    );
    const read = await app.mysql.get('ReadThread', {
      uid: uid,
      thid: thid
    })
    if (read) {
      await app.mysql.update('ReadThread', {
        readAt: moment().format('YYYY-MM-DD HH:mm:ss')
      }, {
        where: {
          uid: uid,
          thid: thid
        }
      })
    } else {
      await app.mysql.insert('ReadThread', {
        uid: uid,
        thid: thid,
        readAt: moment().format('YYYY-MM-DD HH:mm:ss')
      })
    }
    return messageList;
  }

  async replyMessage(thid, uid, mtitle, mbody) {

    const { app } = this;
    const result = await app.mysql.insert('message', {
      thid: thid,
      uid: uid,
      mtitle: mtitle,
      mbody: mbody,
      createAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });

    return {
      status: true
    }

  }
}

module.exports = MessageService;
