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
}

module.exports = NeighborService;
