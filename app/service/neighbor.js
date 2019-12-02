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
        const {app} = this;
        const neighborList = await app.mysql.query(
            'SELECT U.* FROM Neighbor AS N LEFT JOIN `User` AS U on N.recipient_uid = U.uid\
            WHERE applicant_uid = ?', [uid]
        )
        return neighborList;
    }

}

module.exports = NeighborService;
