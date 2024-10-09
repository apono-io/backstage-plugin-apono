# Backstage Apono plugin

Welcome to the Apono plugin!

## Getting started

### Enabling frontend

```bash
yarn --cwd packages/app add @apono-io/backstage-plugin-apono
```

After you install the plugin, you need to add it to the route in `packages/app/src/App.tsx`:

```tsx
import { AponoPage } from '@apono-io/backstage-plugin-apono';

// Inside your App component's routes
<Route path="/apono" element={<AponoPage />} />
```

### Enabling backend

See [backstage-plugin-apono-backend](https://github.com/apono-io/backstage-plugin-apono-backend#enabling-backend).

## Contributing

Everyone is welcome to contribute to this repository. Feel free to raise [issues](https://github.com/apono-io/backstage-plugin-apono/issues) or to submit [Pull Requests.](https://github.com/apono-io/backstage-plugin-apono/pulls)
