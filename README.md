# Arbi Unified Frontend

Neobrutalist design dashboard consolidating all Arbi services into a single SPA.

## Features

- 🎨 **Neobrutalist Design**: Thick borders, bold colors, flat shadows
- 📱 **Mobile-First**: Responsive with hamburger menu
- 🚀 **Client-Side Routing**: Fast navigation without page reloads
- 🔗 **Unified Interface**: Single frontend for wallet, email, analytics, onchain data

## Architecture

- **Frontend**: Vanilla JavaScript ES6 modules
- **Styling**: Pure CSS with neobrutalist design system
- **Routing**: Custom lightweight client-side router
- **Backend APIs**: All services remain at their subdomains

## Development

```bash
# Serve locally
python3 -m http.server 8080 --directory public

# Or use any static server
npx serve public
```

## Deployment

```bash
# Build and run with Docker
docker-compose up -d

# Or deploy to production
docker build -t arbi-frontend .
docker run -d -p 3500:80 arbi-frontend
```

## Routes

- `/` - Dashboard (overview widgets)
- `/wallet` - Wallet balances and tokens
- `/email` - Email automation status
- `/analytics` - Historical analytics
- `/onchain` - Blockchain activity monitoring

## Design System

### Colors
- Yellow: `#FFE600`
- Pink: `#FF6B9D`
- Blue: `#4ECDC4`
- Black: `#000000`

### Borders
- All elements: 3px solid black

### Shadows
- Default: 4px 4px 0 black
- Hover: 6px 6px 0 black

### Fonts
- Headings: Space Grotesk
- Body: Inter
