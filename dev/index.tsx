import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { aponoPlugin, AponoPage } from '../src/plugin';

createDevApp()
  .registerPlugin(aponoPlugin)
  .addPage({
    element: <AponoPage />,
    title: 'Root Page',
    path: '/apono',
  })
  .render();
