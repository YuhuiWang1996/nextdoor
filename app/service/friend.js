'use strict';

const Service = require('egg').Service;

class FriendService extends Service {
    async friendRequest(applicant_uid, recipient_uid) {
        const { app } = this;

        const result = await app.mysql.update('Friend',
            {
                status: 1002 //pending
            }, {
            where: {
                applicant_uid: applicant_uid,
                recipient_uid: recipient_uid
            }
        });

        if (result.affectedRows == 0) {
            await app.mysql.insert('Friend',
                {
                    applicant_uid: applicant_uid,
                    recipient_uid: recipient_uid,
                    status: 1002 // pending
                });
        }

        return {
            status: true
        }
    }

    async removeFriend(applicant_uid, recipient_uid) {
        const { app } = this;

        await app.mysql.update('Friend',
            {
                status: 1004 // remove
            }, { where: { applicant_uid, recipient_uid } });

        await app.mysql.update('Friend',
            {
                status: 1004 // remove
            }, { where: { recipient_uid, applicant_uid } });

        return {
            status: true
        }
    }

    async getFriendListByUid(uid) {

        const { app } = this;

        const friendList = await app.mysql.query(
            'SELECT * FROM `User` AS U\
            NATURAL JOIN (( SELECT F1.recipient_uid AS uid FROM Friend AS F1 WHERE F1.`status` = 1001 AND F1.applicant_uid = ? ) UNION\
            ( SELECT F2.applicant_uid AS uid FROM Friend AS F2 WHERE F2.`status` = 1001 AND F2.recipient_uid = ? )) AS T', [uid, uid]);

        return friendList;

    }

}

module.exports = FriendService;
