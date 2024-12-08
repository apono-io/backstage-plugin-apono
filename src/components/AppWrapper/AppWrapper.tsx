import React from 'react';
import { Content, Header, HeaderLabel, Page } from '@backstage/core-components';
import { useApi,  configApiRef } from '@backstage/core-plugin-api';

import { AponoIframe } from '../AponoIframe';
import { useProfile } from './useProfile';

const defaultClientUrl = 'https://backstage-client.apono.io';

export function AppWrapper() {
  const config = useApi(configApiRef);
  const clientUrl = config.getOptionalString('apono.clientUrl') || defaultClientUrl;
  const supportLinks = config.getOptionalConfigArray('apono.supportLinks') || [];
  const { profile, loading } = useProfile();

  return (
    <Page themeId="tool" >
      <Header
        title="Apono"
        subtitle="Dynamic, just-in-time, just-enough access management that developers love."
      >
        {supportLinks.map((link) => (
          <HeaderLabel key={link.getString('label')} label={link.getString('label')} value={link.getString('value')} url={link.getString('url')} />
        ))}
        <HeaderLabel label={profile?.displayName || 'Unknown'} value={profile?.email} />
      </Header>
      {!loading && (
        <Content stretch noPadding>
          <AponoIframe clientUrl={clientUrl} profile={profile || undefined} />
        </Content>
      )}
    </Page>
  );
}
