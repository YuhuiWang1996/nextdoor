'use strict';

const Service = require('egg').Service;

class HoodService extends Service {

    async getAllResidentsByUid(uid) {
        const { app } = this;
        
        const residentList = await app.mysql.query(
            'SELECT bname, ufirstname, ulastname, uid, ISNULL( N.applicant_uid ) AS is_neighbor, ISNULL( F.applicant_uid ) AS is_friend , F.`status` AS friendStatus \
            FROM ( SELECT bname, ufirstname, ulastname, uid \
            FROM Block NATURAL JOIN hood NATURAL JOIN BlockJoin NATURAL JOIN `User` \
            NATURAL JOIN ( SELECT hid FROM BlockJoin NATURAL JOIN block NATURAL JOIN `User` WHERE uid = ? ) AS myHood \
            WHERE `status` = 1001 AND uid <> ? ) AS T \
            LEFT JOIN Neighbor AS N ON N.applicant_uid = ? \
            AND T.uid = N.recipient_uid\
            LEFT JOIN Friend AS F ON \
            ( F.applicant_uid = ? AND T.uid = F.recipient_uid ) \
            OR ( F.recipient_uid = ? AND T.uid = F.applicant_uid )', [uid, uid, uid, uid, uid]);

        return residentList;
    }

}

module.exports = HoodService;
