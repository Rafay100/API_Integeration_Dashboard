const express = require('express');
const router = express.Router();
const {
  healthCheck,
  getCrypto,
  getGithubProfile,
  getRandomUserData,
  getJoke,
  getDailyQuote,
} = require('../controllers/apiController');

router.get('/health', healthCheck);
router.get('/crypto', getCrypto);
router.get('/github/:username', getGithubProfile);
router.get('/random-user', getRandomUserData);
router.get('/jokes', getJoke);
router.get('/quote', getDailyQuote);

module.exports = router;
