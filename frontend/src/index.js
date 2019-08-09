import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks'

import App from './App'

const cache = new InMemoryCache()
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    // headers: {
    //   authorization: localStorage.getItem('token'),
    //   'client-name': 'Space Explorer [web]',
    //   'client-version': '1.0.0',
    // },
  }),
})

ReactDOM.render(<ApolloProvider client={client}>
    <App/>
</ApolloProvider>

, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
