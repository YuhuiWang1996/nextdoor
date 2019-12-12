'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/api/register/block/list', controller.register.blockList);
  router.post('/api/register/create', controller.register.register);
  router.get('/api/register/block/list', controller.setting.account.block.blockList);
  router.get('/api/register/block/hood/list', controller.setting.account.block.hoodList);
  router.post('/api/login', controller.login.login);

  router.get('/api/jwt/user/info', controller.home.userinfo);

  router.get('/api/jwt/console/thread/list', controller.forum.thread.getAllThreadList);

  router.post('/api/jwt/search/message', controller.search.search);

  router.get('/api/jwt/hood/resident/list', controller.hood.resident.residentList);
  router.post('/api/jwt/hood/resident/friend/sendRequest', controller.hood.resident.sentFriendRequest);
  router.post('/api/jwt/hood/resident/neighbor/add', controller.hood.resident.addNeighbor);
  router.post('/api/jwt/hood/resident/friend/remove', controller.hood.resident.removeFriend);
  router.post('/api/jwt/hood/resident/neighbor/remove', controller.hood.resident.removeNeighbor);

  router.get('/api/jwt/block/resident/list', controller.block.resident.residentList);
  router.post('/api/jwt/block/resident/friend/sendRequest', controller.block.resident.sentFriendRequest);
  router.post('/api/jwt/block/resident/neighbor/add', controller.block.resident.addNeighbor);
  router.post('/api/jwt/block/resident/friend/remove', controller.block.resident.removeFriend);
  router.post('/api/jwt/block/resident/neighbor/remove', controller.block.resident.removeNeighbor);
  router.get('/api/jwt/block/newresident/list', controller.block.newresident.newResidentList);
  router.post('/api/jwt/block/newresident/approve', controller.block.newresident.approve);

  router.get('/api/jwt/forum/topic/list', controller.forum.topic.topicList);
  router.get('/api/jwt/forum/topic/thread', controller.forum.topic.threadList);
  router.get('/api/jwt/forum/topic/detail', controller.forum.topic.topicDetail);
  router.get('/api/jwt/forum/topic/new/friendAndNeighborList', controller.forum.topic.friendAndNeighborList);
  router.post('/api/jwt/forum/topic/new/submit', controller.forum.topic.newTopic);
  router.get('/api/jwt/forum/topic/receiver', controller.forum.topic.receiverList);
  router.get('/api/jwt/forum/thread/detail', controller.forum.message.messageList);
  router.post('/api/jwt/forum/thread/new', controller.forum.thread.new);
  router.get('/api/jwt/forum/thread/unread', controller.forum.thread.unreadThreadList);
  router.post('/api/jwt/forum/message/reply', controller.forum.message.reply);

  router.get('/api/jwt/relation/friend/list', controller.relation.friend.friendList);
  router.get('/api/jwt/relation/friend/potential/list', controller.relation.friend.potentialFriendList);
  router.get('/api/jwt/relation/friend/receive/list', controller.relation.friend.friendRequests);
  router.get('/api/jwt/relation/friend/sent/list', controller.relation.friend.requestsSent);
  router.post('/api/jwt/relation/friend/remove', controller.relation.friend.removeFriend);
  router.post('/api/jwt/relation/friend/accept', controller.relation.friend.acceptFriendRequest);

  router.get('/api/jwt/relation/neighbor/list', controller.relation.neighbor.neighborList);
  router.get('/api/jwt/relation/neighbor/potential/list', controller.relation.neighbor.potentialNeighborList);
  router.post('/api/jwt/relation/neighbor/remove', controller.relation.neighbor.removeNeighbor);
  router.post('/api/jwt/relation/neighbor/add', controller.relation.neighbor.addNeighbor);

  router.get('/api/jwt/setting/profile/detail', controller.setting.account.profile.accountDetail);
  router.post('/api/jwt/setting/profile/edit', controller.setting.account.profile.edit);
  router.post('/api/jwt/setting/password/edit', controller.setting.account.password.edit);
  router.get('/api/jwt/setting/block/list', controller.setting.account.block.blockList);
  router.get('/api/jwt/setting/block/hood/list', controller.setting.account.block.hoodList);
  router.post('/api/jwt/setting/block/edit', controller.setting.account.block.changeBlock);



  // router.post('/api/jwt/');

  // router.get('/product', controller.product.index);
  // router.get('/product/detail', controller.product.detail);
  // router.get('/product/detail/:id', controller.product.detail2);
  // router.post('/product/create', controller.product.create);
  // router.put('/product/update/:id', controller.product.update);
  // router.delete('/product/delete/:id', controller.product.delete);
};
