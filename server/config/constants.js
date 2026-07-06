module.exports = {
  COINGECKO_URL: 'https://api.coingecko.com/api/v3/coins/markets',
  GITHUB_URL: 'https://api.github.com/users',
  RANDOM_USER_URL: 'https://randomuser.me/api/',
  JOKE_URL: 'https://v2.jokeapi.dev/joke/Programming?type=single',
  QUOTE_URL: 'https://api.quotable.io/quotes/random',
  DEFAULT_CRYPTO_PARAMS: {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: 8,
    page: 1,
    sparkline: false,
  },
};
