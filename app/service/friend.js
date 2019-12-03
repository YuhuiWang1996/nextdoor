'use strict';

const Service = require('egg').Service;

class FriendService extends Service {
    async friendRequest(applicant_uid, recipient_uid) {
        const { app } = this;

        await app.mysql.insert('Friend',
            {
                applicant_uid: applicant_uid,
                recipient_uid: recipient_uid
            });

        return {
            status: true
        }
    }

    async removeFriend(applicant_uid, recipient_uid) {
        const { app } = this;

        await app.mysql.delete('Friend',
            {
                applicant_uid: applicant_uid,
                recipient_uid: recipient_uid
            });
        await app.mysql.delete('Friend',
            {
                applicant_uid: recipient_uid,
                recipient_uid: applicant_uid
            });

        return {
            status: true
        }
    }

    async getFriendListByUid(uid) {

        const { app } = this;

        const friendList = await app.mysql.query(
            'SELECT * FROM `User` AS U\
            NATURAL JOIN ( SELECT T1.uid FROM ( SELECT F1.recipient_uid AS uid FROM Friend AS F1 WHERE F1.applicant_uid = ? ) AS T1 INNER JOIN\
            ( SELECT F2.applicant_uid AS uid FROM Friend AS F2 WHERE F2.recipient_uid = ? ) AS T2 ON T1.uid = T2.uid ) AS T', [uid, uid]);

        return friendList;

    }

}

module.exports = FriendService;
