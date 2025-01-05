import React, { act } from 'react'
import { configApiRef } from '@backstage/core-plugin-api'
import { render, screen } from '@testing-library/react'
import { TestApiProvider } from '@backstage/test-utils'
import { AppWrapper } from './AppWrapper'
import { useProfile } from './useProfile'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@backstage/theme'

// Mock the useProfile hook
jest.mock('./useProfile')
const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>

// Mock the AponoIframe component
jest.mock('../AponoIframe', () => ({
  AponoIframe: () => <div data-testid="apono-iframe" />,
}))

describe('AppWrapper', () => {
  const mockConfig = {
    getOptionalString: jest.fn(),
    getOptionalConfigArray: jest.fn(),
    getOptionalBoolean: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockConfig.getOptionalString.mockReturnValue('https://test-client.apono.io')
    mockConfig.getOptionalConfigArray.mockReturnValue([
      {
        getString: (key: string) => ({
          label: 'Test Label',
          value: 'Test Value',
          url: 'https://test.com',
        }[key]),
      },
    ])
  })

  const renderComponent = (children: React.ReactNode) => render(
    <ThemeProvider theme={lightTheme}>
      <TestApiProvider apis={[[configApiRef, mockConfig]]}>
        {children}
      </TestApiProvider>
    </ThemeProvider>
  )

  it('renders correctly with valid profile', () => {
    mockUseProfile.mockReturnValue({
      profile: {
        displayName: 'Test User',
        email: 'test@example.com',
      },
      loading: false,
      error: null,
      refresh: jest.fn(),
    })

    act(() => {
      renderComponent(<AppWrapper />)
    })

    expect(screen.getByText('Apono')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByTestId('apono-iframe')).toBeInTheDocument()
  })

  it('does not render iframe while profile is loading', () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: true,
      error: null,
      refresh: jest.fn(),
    })

    act(() => {
      renderComponent(<AppWrapper />)
    })

    expect(screen.queryByTestId('apono-iframe')).not.toBeInTheDocument()
  })

  it('throws error for invalid client URL', () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      error: null,
      refresh: jest.fn(),
    })
    mockConfig.getOptionalString.mockReturnValue('invalid-url')

    expect(() => {
      renderComponent(<AppWrapper />)
    })
    .toThrow('Invalid client URL')
  })
})
