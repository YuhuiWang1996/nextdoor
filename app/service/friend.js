'use strict';

const Service = require('egg').Service;

class FriendService extends Service {
    async friendRequest(applicant_uid, recipient_uid) {
        const { app } = this;
        // Friendship is set when both sent a friend request.
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

    async getFriendRequestsListByUid(uid) {
        const { app } = this;
        const friendRequests = await app.mysql.query(
            'SELECT * FROM `User` AS U NATURAL JOIN \
            ( SELECT uid FROM ( SELECT T1.uid FROM (\
                ( SELECT F1.recipient_uid AS uid FROM Friend AS F1 WHERE F1.applicant_uid = ? ) AS T1\
                INNER JOIN ( SELECT F2.applicant_uid AS uid FROM Friend AS F2 WHERE F2.recipient_uid = ? ) AS T2 ON T1.uid = T2.uid \
                ) UNION ALL ( SELECT applicant_uid AS uid FROM Friend WHERE recipient_uid = ? ) ) AS T \
                GROUP BY uid HAVING count( * ) = 1 ORDER BY uid ) AS T1', [uid, uid, uid]
        )
        return friendRequests;
    }

    async getRequestsSentListByUid(uid) {
        const { app } = this;
        const friendRequests = await app.mysql.query(
            'SELECT * FROM `User` AS U NATURAL JOIN \
            ( SELECT uid FROM ( SELECT T1.uid FROM (\
                ( SELECT F1.recipient_uid AS uid FROM Friend AS F1 WHERE F1.applicant_uid = ? ) AS T1\
                INNER JOIN ( SELECT F2.applicant_uid AS uid FROM Friend AS F2 WHERE F2.recipient_uid = ? ) AS T2 ON T1.uid = T2.uid \
                ) UNION ALL ( SELECT recipient_uid AS uid FROM Friend WHERE applicant_uid = ? ) ) AS T \
                GROUP BY uid HAVING count( * ) = 1 ORDER BY uid ) AS T1', [uid, uid, uid]
        )
        return friendRequests;
    }

}

module.exports = FriendService;
