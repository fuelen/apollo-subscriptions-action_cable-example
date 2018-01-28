import * as React from 'react'
import { render } from 'react-dom'

import { ApolloProvider, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ActionCable from 'actioncable';
import ActionCableLink from 'graphql-ruby-client/subscriptions/ActionCableLink';

const cable = ActionCable.createConsumer("ws://localhost:3000/cable")

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include'
});

const hasSubscriptionOperation = ({ query: { definitions } }) => {
  return definitions.some(
    ({ kind, operation }) => kind === 'OperationDefinition' && operation === 'subscription'
  )
}

const link = ApolloLink.split(
  hasSubscriptionOperation,
  new ActionCableLink({cable}),
  httpLink
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

const TEST_SUBSCRIPTION = gql`
subscription {
  newTemplate: templateWasCreated {
    id
    name
  }
}
`

// Our App
const App = graphql(TEST_SUBSCRIPTION)((params) => {
  console.log(params)
  if (params.data.loading) {
    return 'Waiting for records'
  }

  return (
    <div>
      <div>Woohoo!</div>
      {JSON.stringify(params.data)}
    </div>
  )
})

const ApolloApp = (
  <ApolloProvider client={client}>
  <App />
  </ApolloProvider>
)

render(ApolloApp, document.getElementById('root'))
