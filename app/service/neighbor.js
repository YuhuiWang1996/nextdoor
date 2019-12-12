'use strict';

const Service = require('egg').Service;

class NeighborService extends Service {
    async addNeighbor(applicant_uid, recipient_uid) {
        const { app } = this;

        const result = await app.mysql.insert('Neighbor',
            {
                applicant_uid: applicant_uid,
                recipient_uid: recipient_uid
            });

        return {
            status: true
        }
    }
    async removeNeighbor(applicant_uid, recipient_uid) {
        const { app } = this;

        const result = await app.mysql.delete('Neighbor',
            {
                applicant_uid: applicant_uid,
                recipient_uid: recipient_uid
            });

        return {
            status: true
        }
    }

    async getNeighborListByUid(uid) {
        const { app } = this;
        const neighborList = await app.mysql.query(
            'SELECT U.* FROM Neighbor AS N LEFT JOIN `User` AS U on N.recipient_uid = U.uid\
            WHERE applicant_uid = ?', [uid]
        )
        return neighborList;
    }

    async getPotentialNeighborListByUid(uid) {
        const { app } = this;
        const neighborList = await app.mysql.query(
            'SELECT bname, bid, mybid, ufirstname, ulastname, uid, ISNULL( N.applicant_uid) AS is_neighbor, bid = mybid AS is_sameBlock \
            FROM(SELECT bid, mybid, bname, ufirstname, ulastname, uid \
                     FROM Block NATURAL JOIN hood NATURAL JOIN BlockJoin NATURAL JOIN `User` NATURAL JOIN \
                     (SELECT hid, bid AS mybid FROM BlockJoin NATURAL JOIN block NATURAL JOIN `User` WHERE uid = ? AND `status` = 1001) AS myHood \
                     WHERE `status` = 1001 AND uid <> ? ) AS T \
                     LEFT JOIN Neighbor AS N ON N.applicant_uid = ? AND T.uid = N.recipient_uid \
                     WHERE ISNULL( N.applicant_uid ) = 1', [uid, uid, uid]
        )
        return neighborList;
    }

}

module.exports = NeighborService;
