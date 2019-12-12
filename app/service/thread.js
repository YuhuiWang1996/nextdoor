'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class ThreadService extends Service {

    async getUnreadThreadListByUid(uid, page, limit) {

        const { app } = this;

        const threadList = await app.mysql.query(
            'SELECT\
            ThreadLatestMsg.thid, ReadThread.readAt, ThreadLatestMsg.latestCreateAt, ThreadLatestMsg.initialCreateAt,\
            M1.mid AS latestMid, M1.mtitle AS latestMtitle, M1.mbody AS latestMbody, M2.mid AS initialMid, M2.mtitle AS initialMtitle, M2.mbody AS initialMbody,\
            T.tid, T.tsubject, latest_user.ufirstname, latest_user.ulastname \
        FROM\
            ( SELECT PermissionThread.thid, MAX( createAt ) AS latestCreateAt, min( createAt ) AS initialCreateAt FROM\
            PermissionThread LEFT JOIN Message ON PermissionThread.thid = Message.thid WHERE PermissionThread.uid = ? GROUP BY PermissionThread.thid ) AS ThreadLatestMsg\
            LEFT JOIN ReadThread ON ReadThread.thid = ThreadLatestMsg.thid AND ReadThread.uid = ?\
            LEFT JOIN Message AS M1 ON M1.createAt = ThreadLatestMsg.latestCreateAt\
            LEFT join `User` AS latest_user ON M1.uid = latest_user.uid\
            LEFT JOIN Message AS M2 ON M2.createAt = ThreadLatestMsg.initialCreateAt\
            LEFT JOIN Thread AS TH ON ThreadLatestMsg.thid = TH.thid\
            LEFT JOIN Topic AS T ON TH.tid = T.tid \
        WHERE readAt IS NULL OR latestCreateAt > readAt ORDER BY ThreadLatestMsg.latestCreateAt DESC LIMIT ? OFFSET ?', [uid, uid, parseInt(limit), (page - 1) * limit]);

        const count = await app.mysql.query(
            'SELECT count(*) AS cnt FROM\
            ( SELECT PermissionThread.thid, MAX( createAt ) AS latestCreateAt, min( createAt ) AS initialCreateAt FROM\
            PermissionThread LEFT JOIN Message ON PermissionThread.thid = Message.thid WHERE PermissionThread.uid = ? GROUP BY PermissionThread.thid ) AS ThreadLatestMsg\
            LEFT JOIN ReadThread ON ReadThread.thid = ThreadLatestMsg.thid AND ReadThread.uid = ?\
            LEFT JOIN Message AS M1 ON M1.createAt = ThreadLatestMsg.latestCreateAt\
            LEFT JOIN Message AS M2 ON M2.createAt = ThreadLatestMsg.initialCreateAt\
            LEFT JOIN Thread AS TH ON ThreadLatestMsg.thid = TH.thid\
            LEFT JOIN Topic AS T ON TH.tid = T.tid \
        WHERE readAt IS NULL OR latestCreateAt > readAt', [uid, uid])

        for (let thread of threadList) {
            if (thread.initialAddr) {
                thread.initialAddr = thread.initialAddr.toString('utf-8').split(',')[0];
            }
            if (thread.latestAddr) {
                thread.latestAddr = thread.latestAddr.toString('utf-8').split(',')[0];
            }
        }

        return {
            count: count[0].cnt,
            threadList: threadList
        };

    }

    async getAllThreadListByUid(uid, type, page, limit) {
        const { app } = this;

        let count_sql = 'SELECT count(*) AS cnt FROM\
            ( SELECT PermissionThread.thid, MAX( createAt ) AS latestCreateAt, min( createAt ) AS initialCreateAt FROM\
            PermissionThread LEFT JOIN Message ON PermissionThread.thid = Message.thid WHERE PermissionThread.uid = ? GROUP BY PermissionThread.thid ) AS ThreadLatestMsg\
            LEFT JOIN ReadThread ON ReadThread.thid = ThreadLatestMsg.thid AND ReadThread.uid = ?\
            LEFT JOIN Message AS M1 ON M1.createAt = ThreadLatestMsg.latestCreateAt\
            LEFT join `User` AS latest_user ON M1.uid = latest_user.uid\
            LEFT JOIN Message AS M2 ON M2.createAt = ThreadLatestMsg.initialCreateAt\
            LEFT JOIN Thread AS TH ON ThreadLatestMsg.thid = TH.thid\
            LEFT JOIN Topic AS T ON TH.tid = T.tid';

        let sql = 'SELECT\
            ThreadLatestMsg.thid, ReadThread.readAt, ThreadLatestMsg.latestCreateAt, ThreadLatestMsg.initialCreateAt,\
            M1.mid AS latestMid, M1.mtitle AS latestMtitle, M1.mbody AS latestMbody, latest_user.ufirstname, latest_user.ulastname,\
            M2.mid AS initialMid, M2.mtitle AS initialMtitle, M2.mbody AS initialMbody,\
            T.tid, T.tsubject, T.recipient_bid, T.recipient_hid, T.recipient_isFriends, T.recipient_uid,\
            (readAt IS NULL OR latestCreateAt > readAt) AS isRead, M1.maddr_name AS latestAddr, M2.maddr_name AS initialAddr\
        FROM\
            ( SELECT PermissionThread.thid, MAX( createAt ) AS latestCreateAt, min( createAt ) AS initialCreateAt FROM\
            PermissionThread LEFT JOIN Message ON PermissionThread.thid = Message.thid WHERE PermissionThread.uid = ? GROUP BY PermissionThread.thid ) AS ThreadLatestMsg\
            LEFT JOIN ReadThread ON ReadThread.thid = ThreadLatestMsg.thid AND ReadThread.uid = ?\
            LEFT JOIN Message AS M1 ON M1.createAt = ThreadLatestMsg.latestCreateAt\
            LEFT join `User` AS latest_user ON M1.uid = latest_user.uid\
            LEFT JOIN Message AS M2 ON M2.createAt = ThreadLatestMsg.initialCreateAt\
            LEFT JOIN Thread AS TH ON ThreadLatestMsg.thid = TH.thid\
            LEFT JOIN Topic AS T ON TH.tid = T.tid';

        switch (type) {
            case 'block':
                sql += ' WHERE T.recipient_bid IS NOT NULL';
                count_sql += ' WHERE T.recipient_bid IS NOT NULL';
                break;
            case 'hood':
                sql += ' WHERE T.recipient_hid IS NOT NULL';
                count_sql += ' WHERE T.recipient_hid IS NOT NULL';
                break;
            case 'friend':
                sql += ' WHERE T.recipient_isFriends = 1';
                count_sql += ' WHERE T.recipient_isFriends = 1';
                break;
            case 'user':
                sql += ' WHERE T.recipient_uid IS NOT NULL';
                count_sql += ' WHERE T.recipient_uid IS NOT NULL';
                break;
            default:
                break;
        }

        sql += ' ORDER BY isRead DESC, ThreadLatestMsg.latestCreateAt DESC LIMIT ? OFFSET ?';

        const threadList = await app.mysql.query(sql, [uid, uid, parseInt(limit), (page - 1) * limit]);
        for (let thread of threadList) {
            if (thread.initialAddr) {
                thread.initialAddr = thread.initialAddr.toString('utf-8').split(',')[0];
            }
            if (thread.latestAddr) {
                thread.latestAddr = thread.latestAddr.toString('utf-8').split(',')[0];
            }
        }
        const count = await app.mysql.query(count_sql, [uid, uid]);
        return {
            count: count[0].cnt,
            threadList: threadList
        };
    }



    async create(uid, tid, mtitle, mbody, receiver_uids, mlat, mlng, maddr_name) {
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
                mlat: mlat ? mlat : null,
                mlng: mlng ? mlng : null,
                maddr_name: maddr_name ? maddr_name : null,
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
