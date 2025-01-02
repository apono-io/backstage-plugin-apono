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

## Configuration

### Support Links

The `supportLinks` configuration allows you to define custom support links that will be displayed in the application. Add the following to your `app-config.yaml`:

```yaml
apono:
  supportLinks:
    - label: "Documentation"
      value: "docs"
      url: "https://docs.example.com"
    - label: "Help Center"
      value: "help"
      url: "https://help.example.com"
```

### Safe Safari Check

The `enableSafeSafariCheck` flag enables additional compatibility checks for Safari browsers to mitigate [CVE-2024-44187](https://nvd.nist.gov/vuln/detail/CVE-2024-44187). When enabled, the application will perform extra validation to ensure features work correctly and securely in Safari. If you want to enable this feature, add the following to your `app-config.yaml`:

```yaml
apono:
  enableSafeSafariCheck: true
```

## Contributing

Everyone is welcome to contribute to this repository. Feel free to raise [issues](https://github.com/apono-io/backstage-plugin-apono/issues) or to submit [Pull Requests.](https://github.com/apono-io/backstage-plugin-apono/pulls).
