# API Integration Dashboard

A production-ready dashboard that demonstrates secure API integration through an Express backend proxy. The frontend never calls third-party APIs directly and instead consumes data from local backend endpoints.

## Features

- Backend proxy for CoinGecko, GitHub, Random User, quotes, and jokes
- Responsive glassmorphism UI with a dark/light mode toggle
- Live crypto cards, charts, search, loading states, and toasts
- Compression, Helmet, rate limiting, and structured error handling

## Tech Stack

- Node.js
- Express.js
- Axios
- Chart.js
- Vanilla JavaScript

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

Open http://localhost:5000

## Environment Variables

Copy .env.example to .env and adjust values when needed.

## Screenshots

- Placeholder: Add screenshots of the dashboard hero section and chart view here.

## Folder Structure

- server/ - Express backend and route handlers
- public/ - Static frontend assets
- README.md - Project overview

## API Endpoints

- GET /api/health
- GET /api/crypto
- GET /api/github/:username
- GET /api/random-user
- GET /api/jokes
- GET /api/quote

## Future Improvements

- Add authentication and API key management
- Expand charts and analytics widgets
- Add persisted favorites and saved searches

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

MIT
"# API_Integeration_Dashboard" 
