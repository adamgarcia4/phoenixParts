import React from 'react'
import logo from './logo.svg'
import './App.css'
import { gql } from 'apollo-boost'
import { Query } from 'react-apollo'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const query = gql`
  {
    users {
      bank
      desk
      desk_id
      email
      first_name
      last_name
    }
  }
`

const subscription = gql`
  subscription {
    usersChanged {
      email
    }
  }
`

class App extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reloadsss.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>

          <Query query={query}>
            {({ loading, error, data, subscribeToMore }) => {
              if (loading) return <p>Loading...</p>
              if (error) return <p>Error...</p>

              const { users } = data

              console.log('users:',users)
              
              const columns = [
                {
                  Header: 'First Name',
                  accessor: 'first_name',
                  width: 300
                },
                {
                  Header: 'Last Name',
                  accessor: 'last_name',
                  width: 300
                },
                {
                  Header: 'Email',
                  accessor: 'email',
                  width: 300
                },
                {
                  Header: 'Desk Id',
                  accessor: 'desk_id',
                  width: 300
                },
                {
                  Header: 'Desk',
                  accessor: 'desk',
                  width: 300
                },
                {
                  Header: 'Bank',
                  accessor: 'bank',
                  width: 300
                }
              ]
              
              subscribeToMore({
                document: subscription,
                updateQuery: (prev, updatedData) => {
                  const { subscriptionData } = updatedData
                  console.log('We are updating!!', updatedData)
                  // console.log('prev:',prev)
                  // console.log('subscriptionData:',subscriptionData)
                  const user = subscriptionData.data.usersChanged
                  
                  console.log('user:',user)
                  
                  // TODO: Need to return the new users array here taking into account modifications.
                  return JSON.stringify(user)
                }
              })

              return <ReactTable data={users} columns={columns}/>
            }}
          </Query>
        </header>
      </div>
    )
  }
}

export default App
