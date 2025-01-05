import React, { act } from 'react'
import { render, screen } from '@testing-library/react'
import { AponoIframe } from './AponoIframe'
import { TestApiProvider } from '@backstage/test-utils'
import { aponoApiRef } from '../../api'

const mockProfile = {
  email: 'test@example.com',
  displayName: 'Test User',
}

const mockAponoApi = {
  authenticate: jest.fn().mockResolvedValue({ token: 'test-token' }),
}

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockAponoApi,
}));

describe('AponoIframe', () => {
  const defaultProps = {
    clientUrl: new URL('https://test.apono.io'),
    profile: mockProfile,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders iframe with correct props', () => {
    act(() => {
      render(
        <TestApiProvider apis={[[aponoApiRef, mockAponoApi]]}>
          <AponoIframe {...defaultProps} />
        </TestApiProvider>
      )
    })

    const iframe = screen.getByTitle('Apono')
    expect(iframe).toBeInTheDocument()
    expect(iframe).toHaveAttribute('src', defaultProps.clientUrl.toString())
    expect(iframe).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin')
  })

  it('renders error panel when authentication fails', async () => {
    const errorMessage = 'Internal error'
    mockAponoApi.authenticate.mockRejectedValue(new Error(JSON.stringify({ message: errorMessage })))

    act(() => {
      render(
        <TestApiProvider apis={[[aponoApiRef, mockAponoApi]]}>
          <AponoIframe {...defaultProps} />
        </TestApiProvider>
      )
    })

    act(() => {
      // Simulate app ready by dispatching a message event
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'READY' },
          origin: defaultProps.clientUrl.origin,
        })
      )
    })

    const errorPanel = await screen.findByText(errorMessage)
    expect(errorPanel).toBeInTheDocument()
  })

  it('applies correct styles based on app ready state', () => {
    act(() => {
      render(
        <TestApiProvider apis={[[aponoApiRef, mockAponoApi]]}>
          <AponoIframe {...defaultProps} />
        </TestApiProvider>
      )
    })

    const iframe = screen.getByTitle('Apono')
    expect(iframe).toHaveStyle({ opacity: 0 })

    act(() => {
      // Simulate app ready by dispatching a message event
      window.dispatchEvent(
        new MessageEvent('message', {
          data: { type: 'READY' },
          origin: defaultProps.clientUrl.origin,
        })
      )
    })

    expect(iframe).toHaveStyle({ opacity: 1 })
  })
})
