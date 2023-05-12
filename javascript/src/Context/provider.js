import * as React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from 'react-query'
import {CookiesProvider} from 'react-cookie';

function AppProviders({children}) {

  const queryClient = new QueryClient()

  return (
    <Router>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </CookiesProvider>
    </Router>
  )
}

export {
  AppProviders
}