import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { useApi,  configApiRef } from '@backstage/core-plugin-api';

import { AponoIframe } from '../AponoIframe';

const defaultClientUrl = 'https://backstage-client.apono.io';

export function AppWrapper() {
  const config = useApi(configApiRef);
  const clientUrl = config.getOptionalString('apono.clientUrl') || defaultClientUrl;

  return (
    <Page themeId="tool" >
      <Header title="Apono" subtitle="Dynamic, just-in-time, just-enough access management that developers love." />
      <Content stretch noPadding>
        <AponoIframe clientUrl={clientUrl} />
      </Content>
    </Page>
  );
}
