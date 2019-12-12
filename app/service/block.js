'use strict';

const Service = require('egg').Service;
const moment = require('moment');

class BlockService extends Service {

  async getBlockList() {
    const {app} = this;
    const blockList = await app.mysql.query(
      'SELECT * FROM Block NATURAL JOIN Hood'
    );
    return blockList;
  }

  async getBlockListLikeName(name) {
    const { app } = this;
    const blockList = await app.mysql.query(
      'SELECT bid, bname, hname FROM Block NATURAL JOIN Hood \
      WHERE bname LIKE ?', ['%' + name + '%']);
    return blockList;
  }

  async getAllResidentsByUid(uid) {
    const {app} = this;
    const residentList = await app.mysql.query(
      'SELECT\
      ufirstname, ulastname, uid,\
      ISNULL( N.applicant_uid ) AS is_neighbor,\
      ISNULL( F1.recipient_uid && F2.applicant_uid ) AS is_friend,\
      ISNULL( F1.recipient_uid ) AS is_friend_recipient,\
      ISNULL( F2.applicant_uid ) AS is_friend_applicant \
    FROM\
      blockjoin\
      NATURAL JOIN ( SELECT bid FROM BlockJoin WHERE uid = ? AND `status` = 1001 ) AS T\
      NATURAL JOIN `User`\
      LEFT JOIN Neighbor AS N ON N.applicant_uid = ? AND `User`.uid = N.recipient_uid\
      LEFT JOIN Friend AS F1 ON F1.applicant_uid = ? AND `User`.uid = F1.recipient_uid\
      LEFT JOIN Friend AS F2 ON F2.recipient_uid = ? AND `User`.uid = F2.applicant_uid\
    WHERE uid <> ? AND `status` = 1001', [uid, uid, uid, uid, uid]
    )
    return residentList;
  }

  async getBlockNewResidentListByUid(uid) {

    const { app } = this;

    const newResidentList = await app.mysql.query(
      'SELECT `User`.*, BJ.*, BJA.approveAt FROM `User`\
      NATURAL JOIN ( SELECT * FROM BlockJoin WHERE bid = ( SELECT bid FROM BlockJoin WHERE uid = ? AND `status` = 1001 ) AND uid <> ? AND `status` = 1002 ) AS BJ\
      LEFT JOIN BlockJoinApproval AS BJA ON BJA.approver_uid = ? AND BJA.applicant_uid = uid AND BJA.bid = BJ.bid ORDER BY applyAt DESC', [uid, uid, uid]
    );

    return newResidentList;

  }

  async approveBlockJoin(applicant_uid, approver_uid, bid, applyAt) {

    const { app, ctx } = this;

    const result = await app.mysql.beginTransactionScope(async conn => {

      await conn.insert('BlockJoinApproval', {
        applicant_uid: applicant_uid,
        approver_uid: approver_uid,
        bid: bid,
        approveAt: moment().format('YYYY-MM-DD HH:mm:ss')
      });

      const approvals = await conn.query(
        'SELECT * FROM BlockJoinApproval AS BJA \
        WHERE BJA.approveAt > ? AND applicant_uid = ? AND bid = ?', [moment(applyAt).format('YYYY-MM-DD HH:mm:ss'), approver_uid, bid]
      );
      const residents = await conn.select('BlockJoin', {
        where: {
          bid: bid,
          status: 1001
        }
      });

      if (approvals.length >= 3 || approvals.length + 1 == residents.length) {
        await conn.update('BlockJoin', {
          status: 1001
        }, {
          where: {
            bid: bid,
            uid: applicant_uid
          }
        })
      }

      return { success: true };

    }, ctx);

  }

}

module.exports = BlockService;
