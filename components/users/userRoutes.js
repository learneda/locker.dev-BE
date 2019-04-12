const router = require('express').Router();
const controllers = require('./userControllers');

// ==============================================
// this JS file includes helpers that access our
// database accordingly (for example, getUsers
// requests all the users in the users database)
// ==============================================

router.get('/followStats', controllers.getUserFollowStats);

router.get('/newsfeed', controllers.getUserNewsFeed);

router.put('/edit', controllers.editProfile);

router.get('/id/:id', controllers.getUserDetailsById);

router.get('/username/:username', controllers.getUserDetailsByUserName);

router.post('/subscribe', controllers.subscribetoUser);

router.delete('/unsubscribe', controllers.unsubscribetoUser);

router.get('/following/:id', controllers.getFollowing);

module.exports = router;
