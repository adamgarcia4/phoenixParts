import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { getMainDefinition } from 'apollo-utilities';

import { ApolloProvider, ApolloConsumer } from 'react-apollo';
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloClient, InMemoryCache } from 'apollo-boost';


const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
})

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true
  }
})

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const link = ApolloLink.from([terminatingLink])
const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache
})

ReactDOM.render(<ApolloProvider client={client}>
  
  <ApolloConsumer>
    {client => <App client={client}/>}
  </ApolloConsumer>

  
</ApolloProvider>

, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
