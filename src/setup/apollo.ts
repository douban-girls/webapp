import { ApolloClient, InMemoryCache, ApolloLink, from, HttpLink } from '@apollo/react-hooks'
import { onError } from "@apollo/client/link/error"
import { toast } from 'react-toastify'

export const prefix = process.env.NODE_ENV === 'production' ? 'https://api.dbg.annatarhe.com' : 'http://localhost:9009'

// const prefix = 'https://api.dbg.annatarhe.com'

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: { 'athena-token': sessionStorage.getItem('athena-token') || '' }
  })
  return forward(operation)
})

// error handle
const errorLink = onError(({ graphQLErrors, response }) => {
  if (!graphQLErrors || !Array.isArray(graphQLErrors)) {
    return
  }
  graphQLErrors.forEach(err => {
    console.log('error', graphQLErrors, response) // eslint-disable-line no-console
    // sendNotification({ title: err.message })
    toast.error(err.message)
  })
})

const link = new HttpLink({
  uri: `${prefix}/graphql/v1`,
  credentials: 'include'
})

const apolloClient = new ApolloClient({
  link: from([authMiddleware, errorLink, link]),
  cache: new InMemoryCache(),
})

export { apolloClient }
