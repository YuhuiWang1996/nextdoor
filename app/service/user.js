'use strict';

const Service = require('egg').Service;

const md5 = require('MD5');
const moment = require('moment');

class UserService extends Service {

    async register(firstname, lastname, email, pwd, gender, intro, bid, uaddr_lat, uaddr_lng, uaddr_name) {
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
                    uaddr_lat: uaddr_lat,
                    uaddr_lng: uaddr_lng,
                    uaddr_name: uaddr_name,
                    registerAt: moment().format('YYYY-MM-DD HH:mm:ss')
                });


            await conn.insert('BlockJoin', {
                bid: bid,
                uid: user.insertId,
                applyAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: 1002 // pending
            });

            return { success: true };
        }, ctx)
    }

    async login(email, pwd) {
        const { ctx, app } = this;
        const result = await app.mysql.get('User', { uemail: email, upwd: md5(pwd) });
        if (result) {
            await app.mysql.insert('Login', { uid: result.uid, loginAt: moment().format('YYYY-MM-DD HH:mm:ss') });
            return {
                status: true,
                uid: result.uid
            }
        } else {
            return {
                status: false,
                msg: 'Invalid Email or Password.'
            }
        }
    }

    async detail(uid) {
        const { app } = this;
        const user = await app.mysql.query(
            'SELECT * FROM `User` LEFT JOIN ( BlockJoin NATURAL JOIN block NATURAL JOIN hood ) \
            ON BlockJoin.uid = `User`.uid AND `status` = 1001 \
            WHERE `User`.uid = ?', [uid]
        )

        user[0].uaddr_name = user[0].uaddr_name.toString('utf8');

        return user;
    }

    async changeInfo(uid, ufirstname, ulastname, uemail, uintro) {
        const { app } = this;
        const result = await app.mysql.update('User', {
            ufirstname: ufirstname,
            ulastname: ulastname,
            uemail: uemail,
            uintro: uintro
        }, {
            where: {
                uid: uid
            }
        });
        return result;
    }

    async changePassword(uid, upwd, newpwd) {
        const { app } = this;
        const user = await app.mysql.get('User', {
            uid: uid,
            upwd: md5(upwd)
        })
        if (user) {
            await app.mysql.update('User', {
                upwd: md5(newpwd)
            }, {
                where: {
                    uid: uid
                }
            })
            return true;
        } else {
            return false;
        }
    }

    async changeBlock(uid, bid, uaddr_lat, uaddr_lng, uaddr_name) {
        const { app } = this;
        await app.mysql.update('BlockJoin', {
            status: 1003 // leave
        }, {
            where: { uid: uid }
        });

        await app.mysql.update('User', {
            uaddr_lat: uaddr_lat,
            uaddr_lng: uaddr_lng,
            uaddr_name: uaddr_name
        }, {
            where: { uid: uid }
        })

        const bj = await app.mysql.get('BlockJoin', {
            uid: uid,
            bid: bid
        });
        if (bj) {
            await app.mysql.update('BlockJoin', {
                applyAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: 1002 // pending
            }, {
                where: {
                    uid: uid,
                    bid: bid
                }
            });
        } else {
            await app.mysql.insert('BlockJoin', {
                bid: bid,
                uid: uid,
                applyAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: 1002 // pending
            });
        }
    }

}

module.exports = UserService;
