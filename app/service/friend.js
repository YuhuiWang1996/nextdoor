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

}

module.exports = FriendService;
