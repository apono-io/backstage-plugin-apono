import React from 'react';
import { Content, Header, HeaderLabel, Page } from '@backstage/core-components';
import { useApi,  configApiRef } from '@backstage/core-plugin-api';

import { AponoIframe } from '../AponoIframe';
import { useProfile } from './useProfile';
import { isValidUrl } from '../helpers';

const defaultClientUrl = 'https://backstage-client.apono.io';

function useAppWrapper() {
  const config = useApi(configApiRef);
  const { profile, loading: isProfileLoading } = useProfile();

  const clientUrl = config.getOptionalString('apono.clientUrl') || defaultClientUrl;

  if (!isValidUrl(clientUrl)) {
    throw new Error('Invalid client URL');
  }

  const clientUrlParsed = new URL(clientUrl);

  const enableSafeSafariCheck = config.getOptionalBoolean('apono.enableSafeSafariCheck') || false;

  return {
    clientUrl: clientUrlParsed,
    supportLinks: config.getOptionalConfigArray('apono.supportLinks') || [],
    profile,
    isProfileLoading,
    enableSafeSafariCheck,
  };
}

export function AppWrapper() {
  const { clientUrl, supportLinks, profile, isProfileLoading, enableSafeSafariCheck } = useAppWrapper();

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
      {!isProfileLoading && (
        <Content stretch noPadding>
          <AponoIframe clientUrl={clientUrl} profile={profile || undefined} checkSafeSafari={enableSafeSafariCheck} />
        </Content>
      )}
    </Page>
  );
}
