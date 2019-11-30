'use strict';

const Service = require('egg').Service;

const md5 = require('MD5');
const moment = require('moment');

class UserService extends Service {

    async register(firstname, lastname, email, pwd, gender, intro, addr) {
        const { ctx, app } = this;
        const result = await app.mysql.beginTransactionScope(async conn => {
            const user = await conn.insert('User',
                {
                    ufirstname: firstname,
                    ulastname: lastname,
                    uemail: email,
                    upwd: md5(pwd),
                    ugender: gender,
                    uintro: intro,
                    lastAccessAt: moment().format('YYYY-MM-DD HH:mm:ss')
                });
            
            const addrs = addr.split(' - ');
            const bname = addrs[0];
            const hname = addrs[1];
            const block = await conn.query('SELECT bid FROM block NATURAL JOIN hood \
                                            WHERE hname = ? AND bname = ?', [hname, bname]);
            await conn.insert('BlockJoin', {
                bid: block[0].bid,
                uid: user.insertId,
                applyAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: 1002 // pending
            });

            return { success: true };
        }, ctx)
    }

}

module.exports = UserService;
