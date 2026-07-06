const { getCryptoData, getGithubUser, getRandomUser, getProgrammingJoke, getQuote } = require('../services/apiService');

async function healthCheck(_req, res, next) {
  try {
    res.json({
      success: true,
      status: 'OK',
      time: new Date().toISOString(),
    });
  } catch (error) {
    next(error);
  }
}

async function getCrypto(_req, res, next) {
  try {
    const data = await getCryptoData();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getGithubProfile(req, res, next) {
  try {
    const { username } = req.params;

    if (!username || !/^[a-zA-Z0-9-]+$/.test(username)) {
      const error = new Error('Please provide a valid GitHub username');
      error.statusCode = 400;
      throw error;
    }

    const data = await getGithubUser(username);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getRandomUserData(_req, res, next) {
  try {
    const data = await getRandomUser();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getJoke(_req, res, next) {
  try {
    const data = await getProgrammingJoke();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

async function getDailyQuote(_req, res, next) {
  try {
    const data = await getQuote();
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  healthCheck,
  getCrypto,
  getGithubProfile,
  getRandomUserData,
  getJoke,
  getDailyQuote,
};
