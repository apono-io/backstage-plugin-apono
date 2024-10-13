import React, { useEffect } from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { useApi,  configApiRef } from '@backstage/core-plugin-api';

import { AponoIframe } from '../AponoIframe';

const defaultClientUrl = 'https://backstage-client.apono.io';

export function AppWrapper() {
  const config = useApi(configApiRef);
  const clientUrl = config.getOptionalString('apono.clientUrl') || defaultClientUrl;

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = `default-src 'self'; frame-src ${clientUrl}`;
    document.head.appendChild(meta);
  }, [clientUrl]);

  return (
    <Page themeId="tool" >
      <Header title="Apono" subtitle="Automate access" />
      <Content stretch noPadding>
        <AponoIframe clientUrl={clientUrl} />
      </Content>
    </Page>
  );
}
