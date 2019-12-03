'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/api/register/block/list', controller.register.blockList);
  router.post('/api/register/create', controller.register.register);
  router.post('/api/login', controller.login.login);

  router.get('/api/jwt/hood/resident/list', controller.hood.resident.residentList);
  router.post('/api/jwt/hood/resident/friend/sendRequest', controller.hood.resident.sentFriendRequest);
  router.post('/api/jwt/hood/resident/neighbor/add', controller.hood.resident.addNeighbor);
  router.post('/api/jwt/hood/resident/friend/remove', controller.hood.resident.removeFriend);
  router.post('/api/jwt/hood/resident/neighbor/remove', controller.hood.resident.removeNeighbor);

  router.get('/api/jwt/block/newresident/list', controller.block.newresident.newResidentList);
  router.post('/api/jwt/block/newresident/approve', controller.block.newresident.approve);

  router.get('/api/jwt/forum/topic/list', controller.forum.topic.topicList);
  router.get('/api/jwt/forum/topic/thread', controller.forum.topic.threadList);
  router.get('/api/jwt/forum/topic/detail', controller.forum.topic.topicDetail);
  router.get('/api/jwt/forum/topic/new/friendAndNeighborList', controller.forum.topic.friendAndNeighborList);
  router.post('/api/jwt/forum/topic/new/submit', controller.forum.topic.newTopic);
  router.get('/api/jwt/forum/topic/receiver', controller.forum.topic.receiverList);
  router.get('/api/jwt/forum/thread/detail', controller.forum.message.messageList);
  router.post('/api/jwt/forum/thread/new', controller.forum.message.new);
  router.post('/api/jwt/forum/message/reply', controller.forum.message.reply);
  router.get('/api/jwt/forum/message/list', controller.forum.message.threadList);


  router.get('/api/jwt/relation/friend/list', controller.relation.friend.friendList);

  // router.post('/api/jwt/');

  // router.get('/product', controller.product.index);
  // router.get('/product/detail', controller.product.detail);
  // router.get('/product/detail/:id', controller.product.detail2);
  // router.post('/product/create', controller.product.create);
  // router.put('/product/update/:id', controller.product.update);
  // router.delete('/product/delete/:id', controller.product.delete);
};
