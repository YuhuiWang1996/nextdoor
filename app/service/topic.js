'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class TopicService extends Service {
  async getTopicListByUid(uid) {

    const { app } = this;

    const topicList = await app.mysql.query(
      'SELECT * FROM topic\
      LEFT JOIN (SELECT bid, bname, hid, hname FROM Hood NATURAL JOIN Block NATURAL JOIN BlockJoin AS BJ WHERE BJ.uid = ? AND BJ.`status` = 1001 ) AS HB ON topic.recipient_bid = HB.bid OR topic.recipient_hid = HB.hid\
      LEFT JOIN ( SELECT uid AS myUid FROM `User` WHERE uid = ? ) AS U ON U.myUid = topic.recipient_uid\
      LEFT JOIN ( SELECT uid AS myTopicUid FROM `User` WHERE uid = ? ) AS TU ON TU.myTopicUid = topic.uid\
      LEFT JOIN ( SELECT T1.uid AS friend_uid FROM ( SELECT F1.recipient_uid AS uid FROM Friend AS F1 WHERE F1.applicant_uid = ? ) AS T1 INNER JOIN\
	( SELECT F2.applicant_uid AS uid FROM Friend AS F2 WHERE F2.recipient_uid = ? ) AS T2 ON T1.uid = T2.uid ) AS F ON F.friend_uid = topic.uid AND topic.recipient_isFriends = 1\
      LEFT JOIN ( SELECT tid AS ttid,ufirstname AS msg_uf, ulastname as msg_ul, mtitle, mbody, createAt AS msg_createAt FROM Message NATURAL JOIN `User` JOIN \
      ( SELECT tid, max( M.createAt ) AS latestCreateAt FROM thread AS T NATURAL JOIN message AS M JOIN PermissionThread AS PT ON PT.thid = T.thid AND PT.uid = ? GROUP BY tid \
      ) AS TM ON TM.latestCreateAt = Message.createAt ) as M on M.ttid = topic.tid \
      LEFT JOIN `User` ON Topic.uid = `User`.uid\
      WHERE bid IS NOT NULL OR hid IS NOT NULL OR myUid IS NOT NULL OR myTopicUid IS NOT NULL OR friend_uid IS NOT NULL', [uid, uid, uid, uid, uid, uid])

    return topicList;

  }

  async getThreadListByTid(uid, tid) {

    const { app } = this;

    const threadList = await app.mysql.query(
      'SELECT\
        ThreadLatestMsg.thid, M2.uid AS postBy, U.ufirstname, U.ulastname, U2.ufirstname AS u2fn, U2.ulastname AS u2ln, ReadThread.readAt, ThreadLatestMsg.latestCreateAt, ThreadLatestMsg.initialCreateAt,\
        M1.mid AS latestMid, M1.mtitle AS latestMtitle, M1.mbody AS latestMbody, M2.mid AS initialMid, M2.mtitle AS initialMtitle, M2.mbody AS initialMbody,\
        T.tid, T.tsubject \
      FROM\
        ( SELECT PermissionThread.thid, MAX( createAt ) AS latestCreateAt, min( createAt ) AS initialCreateAt FROM\
        PermissionThread LEFT JOIN Message ON PermissionThread.thid = Message.thid WHERE PermissionThread.uid = ? GROUP BY PermissionThread.thid ) AS ThreadLatestMsg\
        LEFT JOIN ReadThread ON ReadThread.thid = ThreadLatestMsg.thid AND ReadThread.uid = ?\
        LEFT JOIN Message AS M1 ON M1.createAt = ThreadLatestMsg.latestCreateAt\
        LEFT JOIN Message AS M2 ON M2.createAt = ThreadLatestMsg.initialCreateAt\
        LEFT JOIN Thread AS TH ON ThreadLatestMsg.thid = TH.thid\
        LEFT JOIN Topic AS T ON TH.tid = T.tid \
        LEFT JOIN `User` AS U ON U.uid = M2.uid \
	      LEFT JOIN `User` AS U2 ON U2.uid = M1.uid \
      WHERE T.tid = ?', [uid, uid, tid]
    )

    return threadList;

  }

  async getTopicDetail(tid) {

    const { app } = this;
    const detail = await app.mysql.get('Topic', { tid: tid });

    return detail;

  }

  async getFriendAndNeighborListByUid(uid) {

    const { app } = this;
    const friendAndNeighborList = await app.mysql.query(
      '( SELECT * FROM `User` AS U NATURAL JOIN (\
        SELECT T1.uid FROM ( SELECT F1.recipient_uid AS uid FROM Friend AS F1 WHERE F1.applicant_uid = ? ) AS T1 INNER JOIN\
        ( SELECT F2.applicant_uid AS uid FROM Friend AS F2 WHERE F2.recipient_uid = ? ) AS T2 ON T1.uid = T2.uid\
          ) AS T ) UNION ( SELECT U.* FROM Neighbor AS N LEFT JOIN `User` AS U ON N.recipient_uid = U.uid WHERE applicant_uid = ? )', [uid, uid, uid]
    )

    return friendAndNeighborList;

  }

  async newTopic(uid, tsubject, recipient_uid, is_block, is_hood, is_friends, mtitle, mbody) {

    const { ctx, app } = this;

    const result = await app.mysql.beginTransactionScope(async conn => {

      let recipient_bid = null;
      let recipient_hid = null;
      if (is_block == 1) {
        const blockJoin = await conn.get('BlockJoin', { uid: uid, status: 1001 });
        if (blockJoin) {
          recipient_bid = blockJoin.bid;
        }
      }

      if (is_hood == 1) {
        const blockJoin = await conn.get('BlockJoin', { uid: uid, status: 1001 });
        if (blockJoin) {
          const block = await conn.get('Block', { bid: blockJoin.bid });
          if (block) {
            recipient_hid = block.hid;
          }
        }
      }

      const topic = await conn.insert('Topic', {
        uid: uid,
        tsubject: tsubject,
        createAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        recipient_uid: recipient_uid == 0 ? null : recipient_uid,
        recipient_bid: recipient_bid,
        recipient_hid: recipient_hid,
        recipient_isFriends: is_friends
      });

      const thread = await conn.insert('Thread', {
        tid: topic.insertId
      });
      const thid = thread.insertId;
      let userIdList = new Set();
      userIdList.add(uid);
      if (recipient_uid != 0) {
        userIdList.add(parseInt(recipient_uid));
      }
      if (recipient_bid) {
        const users = await conn.select('BlockJoin', {
          status: 1001,
          bid: recipient_bid
        });
        for (let i in users) {
          userIdList.add(users[i].uid);
        }
      }
      if (recipient_hid) {
        const users = await conn.query(
          'SELECT uid FROM block NATURAL JOIN BlockJoin WHERE `status` = 1001 AND hid = ?', [recipient_hid]
        )
        for (let i in users) {
          userIdList.add(users[i].uid);
        }
      }
      if (is_friends == 1) {
        const users = await conn.query(
          'SELECT T1.uid FROM ( SELECT F1.recipient_uid AS uid FROM Friend AS F1 WHERE F1.applicant_uid = ? ) AS T1 INNER JOIN\
          ( SELECT F2.applicant_uid AS uid FROM Friend AS F2 WHERE F2.recipient_uid = ? ) AS T2 ON T1.uid = T2.uid', [uid, uid]);
        for (let i in users) {
          userIdList.add(users[i].uid);
        }
      }

      for (let uid of userIdList) {
        await conn.insert('PermissionThread', {
          thid: thid,
          uid: uid
        });
      };

      await conn.insert('Message', {
        thid: thid,
        uid: uid,
        mtitle: mtitle,
        mbody: mbody,
        createAt: moment().format('YYYY-MM-DD HH:mm:ss')
      })

      ctx.thid = thid;

      return { success: true };

    }, ctx)

  }

  async getReceiverListByTid(tid, uid) {

    const { app } = this;

    const topic = await app.mysql.get('Topic', { tid: tid });

    let uidList = new Set();
    if (topic.recipient_uid) {
      uidList.add(topic.recipient_uid);
    }
    if (topic.recipient_bid) {
      const users = app.mysql.select('BlockJoin', {
        status: 1001,
        bid: topic.recipient_bid
      });
      for (let i in users) {
        uidList.add(users[i].uid);
      }
    }
    if (topic.recipient_hid) {
      const users = await app.mysql.query(
        'SELECT uid FROM block NATURAL JOIN BlockJoin WHERE `status` = 1001 AND hid = ?', [topic.recipient_hid]
      )
      for (let i in users) {
        uidList.add(users[i].uid);
      }
    }
    if (topic.recipient_isFriends == 1) {
      const users = await app.mysql.query(
        'SELECT T1.uid FROM ( SELECT F1.recipient_uid AS uid FROM Friend AS F1 WHERE F1.applicant_uid = ? ) AS T1 INNER JOIN\
        ( SELECT F2.applicant_uid AS uid FROM Friend AS F2 WHERE F2.recipient_uid = ? ) AS T2 ON T1.uid = T2.uid', [topic.uid, topic.uid]);
      for (let i in users) {
        uidList.add(users[i].uid);
      }
    }

    uidList.delete(uid);

    const users = await app.mysql.select('User', {
      where: {
        uid: Array.from(uidList)
      }
    });

    return users;

  }

}

module.exports = TopicService;
