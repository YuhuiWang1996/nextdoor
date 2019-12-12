'use strict';

const Service = require('egg').Service;

class HoodService extends Service {

    async getAllResidentsByUid(uid) {
        const { app } = this;
        
        const residentList = await app.mysql.query(
            'SELECT bname, ufirstname, ulastname, uid, ISNULL( N.applicant_uid ) AS is_neighbor, \
            ISNULL( F1.recipient_uid && F2.applicant_uid ) AS is_friend,\
            ISNULL( F1.recipient_uid ) AS is_friend_recipient,\
            ISNULL( F2.applicant_uid ) AS is_friend_applicant \
            FROM ( SELECT bname, ufirstname, ulastname, uid \
            FROM Block NATURAL JOIN hood NATURAL JOIN BlockJoin NATURAL JOIN `User` \
            NATURAL JOIN ( SELECT hid FROM BlockJoin NATURAL JOIN block NATURAL JOIN `User` WHERE uid = ? AND `status` = 1001) AS myHood \
            WHERE `status` = 1001 AND uid <> ? ) AS T \
            LEFT JOIN Neighbor AS N ON N.applicant_uid = ? AND T.uid = N.recipient_uid\
            LEFT JOIN Friend AS F1 ON F1.applicant_uid = 6 AND T.uid = F1.recipient_uid\
            LEFT JOIN Friend AS F2 ON F2.recipient_uid = 6 AND T.uid = F2.applicant_uid', [uid, uid, uid, uid, uid]);

        return residentList;
    }

    async getHoodList() {
        const {app} = this;
        const hoodList = await app.mysql.select('Hood');
        return hoodList;
    }

}

module.exports = HoodService;
