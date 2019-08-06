import React from 'react';
import logo from './logo.svg';
import './App.css';
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import { typeIncompatibleAnonSpreadMessage } from 'graphql/validation/rules/PossibleFragmentSpreads';


const query = gql`
  {
    hi
  }
`

const subscription = gql`
  subscription {
    somethingChanged {
      id
    }
  }
`

class App extends React.Component {
  componentDidMount() {
  }
  
  render() {
    return (<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reloadsss.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <Query query={query}>
          {({loading, error, data, subscribeToMore}) => {
            if(loading) return <p>Loading...</p>
            if(error) return <p>Error...</p>

            subscribeToMore({
              document: subscription,
              updateQuery: (prev, { subscriptionData }) => {
                // console.log('prev:',prev)
                // console.log('subscriptionData:',subscriptionData)
                const { id } = subscriptionData.data.somethingChanged
                console.log('id:',id)
                
                return {hi: id}
                // return <p>{subscriptionData.data.somethingChanged.id}</p>
              }
            })

            // {more()}

            return data.hi
          }}

        </Query>



      </header>
    </div>
  )
    }
}

export default App;
