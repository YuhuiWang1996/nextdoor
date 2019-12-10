'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class ThreadService extends Service {

    async getUnreadThreadListByUid(uid) {

        const { app } = this;

        const threadList = app.mysql.query(
            'SELECT\
            ThreadLatestMsg.thid, ReadThread.readAt, ThreadLatestMsg.latestCreateAt,\
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
        WHERE readAt IS NULL OR latestCreateAt > readAt', [uid, uid]);

        return threadList;

    }

    async create(uid, tid, mtitle, mbody, receiver_uids) {
        const { app, ctx } = this;
        const result = await app.mysql.beginTransactionScope(async conn => {
            // create a thread
            const thread = await conn.insert('Thread', {
                tid: tid
            });
            // create an initial message that belongs to this thread
            const message = await conn.insert('Message', {
                thid: thread.insertId,
                uid: uid,
                mtitle: mtitle,
                mbody: mbody,
                createAt: moment().format('YYYY-MM-DD HH:mm:ss')
            });
            // create who can read and reply messages in this thread
            for (let receiver_uid of receiver_uids) {
                await conn.insert('PermissionThread', {
                    thid: thread.insertId,
                    uid: receiver_uid
                })
            }
            // author can also read and reply
            await conn.insert('PermissionThread', {
                thid: thread.insertId,
                uid: uid
            })
            ctx.thid = thread.insertId;
            return { success: true };
        }, ctx);
    }

}

module.exports = ThreadService;
