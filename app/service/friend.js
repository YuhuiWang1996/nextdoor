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

    async getPotentialFriendListByUid(uid) {
        const {app} = this;
        const friendList = await app.mysql.query(
            '	SELECT bname, bid, mybid, ufirstname, ulastname, uid, \
            ISNULL( F1.recipient_uid && F2.applicant_uid) AS is_friend, \
            ISNULL( F1.recipient_uid ) AS is_friend_recipient, \
            ISNULL( F2.applicant_uid ) AS is_friend_applicant, \
            bid = mybid AS is_sameBlock \
            FROM( SELECT bid, mybid, bname, ufirstname, ulastname, uid \
                      FROM Block NATURAL JOIN hood NATURAL JOIN BlockJoin NATURAL JOIN `User` \
                        NATURAL JOIN ( SELECT hid, bid AS mybid FROM BlockJoin NATURAL JOIN block NATURAL JOIN `User` WHERE uid = ? AND `status` = 1001) AS myHood \
                        WHERE `status` = 1001 AND uid <> ? ) AS T \
            LEFT JOIN Friend AS F1 ON F1.applicant_uid = ? AND T.uid = F1.recipient_uid \
            LEFT JOIN Friend AS F2 ON F2.recipient_uid = ? AND T.uid = F2.applicant_uid \
            WHERE ISNULL( F1.recipient_uid ) = 1 AND ISNULL( F2.applicant_uid ) = 1', [uid, uid, uid, uid]
        )

        return friendList;
    }

}

module.exports = FriendService;
