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

### Configuring Content Security Policy

To allow the Apono plugin to load its content in an iframe, you need to add the Apono client URL to your Backstage's Content Security Policy. Add the following to your `app-config.yaml` file:

```yaml
backend:
  csp:
    frame-src: ["'self'", "https://backstage-client.apono.io"]
```

This configuration allows Backstage to load iframes from both its own origin ('self') and the Apono client URL.

Note: If you're using a different environment (e.g., staging), make sure to use the appropriate Apono client URL.

## Contributing

Everyone is welcome to contribute to this repository. Feel free to raise [issues](https://github.com/apono-io/backstage-plugin-apono/issues) or to submit [Pull Requests.](https://github.com/apono-io/backstage-plugin-apono/pulls)
