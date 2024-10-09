import React from 'react';
import { Content, Header, Page } from '@backstage/core-components';
import { useApi,  configApiRef } from '@backstage/core-plugin-api';

import { AponoIframe } from '../AponoIframe';

export function AppWrapper() {
  const config = useApi(configApiRef);
  const clientUrl = config.getString('apono.clientUrl');

  return (
    <Page themeId="tool" >
      <Header title="Apono" subtitle="Automate access" />
      <Content stretch noPadding>
        <AponoIframe clientUrl={clientUrl} />
      </Content>
    </Page>
  );
}
