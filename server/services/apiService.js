const axios = require('axios');
const {
  COINGECKO_URL,
  GITHUB_URL,
  RANDOM_USER_URL,
  JOKE_URL,
  QUOTE_URL,
  DEFAULT_CRYPTO_PARAMS,
} = require('../config/constants');

const createTimeout = (ms = 8000) => axios.create({ timeout: ms });

async function getCryptoData() {
  const client = createTimeout();
  const response = await client.get(COINGECKO_URL, { params: DEFAULT_CRYPTO_PARAMS });

  return response.data.map((coin) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol.toUpperCase(),
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h,
    marketCap: coin.market_cap,
    image: coin.image,
  }));
}

async function getGithubUser(username) {
  const client = createTimeout();
  const response = await client.get(`${GITHUB_URL}/${encodeURIComponent(username)}`);

  return {
    login: response.data.login,
    avatar: response.data.avatar_url,
    followers: response.data.followers,
    repositories: response.data.public_repos,
    bio: response.data.bio || 'No bio available',
    profileUrl: response.data.html_url,
  };
}

async function getRandomUser() {
  const client = createTimeout();
  const response = await client.get(RANDOM_USER_URL, { params: { results: 1 } });
  const [user] = response.data.results;

  return {
    name: `${user.name.first} ${user.name.last}`,
    email: user.email,
    country: user.location.country,
    picture: user.picture.large,
  };
}

async function getProgrammingJoke() {
  const client = createTimeout();
  const response = await client.get(JOKE_URL);
  return { joke: response.data.joke };
}

async function getQuote() {
  const client = createTimeout();
  const response = await client.get(QUOTE_URL);
  const [quote] = response.data;
  return {
    content: quote.content,
    author: quote.author,
  };
}

module.exports = {
  getCryptoData,
  getGithubUser,
  getRandomUser,
  getProgrammingJoke,
  getQuote,
};
