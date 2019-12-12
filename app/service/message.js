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
    for (let message of messageList) {
      if (message.maddr_name) {
        message.maddr_name = message.maddr_name.toString('utf-8').split(',')[0];
      }
    }
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

  async replyMessage(thid, uid, mtitle, mbody, mlat, mlng, maddr_name) {
    const { app } = this;
    // create a new message in this thread
    await app.mysql.insert('message', {
      thid: thid,
      uid: uid,
      mtitle: mtitle,
      mbody: mbody,
      mlat: mlat ? mlat : null,
      mlng: mlng ? mlng : null,
      maddr_name: maddr_name ? maddr_name : null,
      createAt: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    return {
      status: true
    }
  }

  async searchMessage(uid, mcontent, mlat, mlng, radius) {
    const { app } = this;
    let sql = "SELECT M.*, T.tsubject,U.ufirstname,U.ulastname,\
    100 * SQRT ( POW( M.mlat - ?, 2 ) + POW( ( M.mlng - ? ) * COS( ? ), 2 ) ) AS distance \
  FROM\
    PermissionThread AS PT\
    JOIN Message AS M ON PT.thid = M.thid\
    JOIN Thread AS TH ON TH.thid = M.thid\
    JOIN Topic AS T ON TH.tid = T.tid \
    JOIN `User` AS U ON M.uid = U.uid \
  WHERE\
    PT.uid = ? \
    AND ( M.mbody LIKE ? OR M.mtitle LIKE ? )";
    if (mlat && mlng && radius) {
      sql += 'AND 100 * SQRT (\
        POW( M.mlat - ?, 2 ) + POW( ( M.mlng - ? ) * COS( ? ), 2 ) \
        ) < ?';
    }
    const result = await app.mysql.query(
      sql, [parseFloat(mlat), parseFloat(mlng), parseFloat(mlat),
      uid, '%' + mcontent + '%', '%' + mcontent + '%', parseFloat(mlat), parseFloat(mlng), parseFloat(mlat), parseFloat(radius) / 1000]
    );

    return result;
  }

}

module.exports = MessageService;
