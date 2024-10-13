import React, { useEffect } from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { useApi,  configApiRef } from '@backstage/core-plugin-api';

import { AponoIframe } from '../AponoIframe';

const defaultClientUrl = 'https://backstage-client.apono.io';

export function AppWrapper() {
  const config = useApi(configApiRef);
  const clientUrl = config.getOptionalString('apono.clientUrl') || defaultClientUrl;

  return (
    <>
      <CSPEffect clientUrl={clientUrl} />
      <Page themeId="tool" >
        <Header title="Apono" subtitle="Automate access" />
        <Content stretch noPadding>
          <AponoIframe clientUrl={clientUrl} />
        </Content>
      </Page>
    </>
  );
}

function CSPEffect({ clientUrl }: { clientUrl: string }) {
  useEffect(() => {
    let meta: HTMLMetaElement | null = document.querySelector('meta[http-equiv="Content-Security-Policy"]');

    if (clientUrl) {
      if (!meta) {
        meta = document.createElement('meta');
        meta.httpEquiv = "Content-Security-Policy";
        document.head.appendChild(meta);
      }
      meta.content = `default-src 'self'; frame-src ${clientUrl}`;
    } else if (meta) {
      document.head.removeChild(meta);
    }

    return () => {
      if (meta && document.head.contains(meta)) {
        document.head.removeChild(meta);
      }
    };
  }, [clientUrl]);

  return null;
}
