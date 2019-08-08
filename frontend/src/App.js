import React from 'react'
import logo from './logo.svg'
import './App.css'
import {gql} from 'apollo-boost'
import ReactTable from 'react-table'
import _ from 'lodash';
import hoc from './GraphqlHOC'

import 'react-table/react-table.css'

const userQuery = gql`
  {
    users {
      bank
      desk
      desk_id
      email
      first_name
      last_name
      uid
      _id
    }
  }
`

const usersSubscription = gql`
  subscription {
    usersChanged {
      bank
      desk
      desk_id
      email
      first_name
      last_name
      uid
      _id
    }
  }
`

class App extends React.Component {

  render() {
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
      },
      {
        Header: 'uid',
        accessor: 'uid',
        width: 300
      }
    ]

    console.log("little thing in the front", this.props.data)
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Edit <code>src/App.js</code> and save to reloadsss.
            </p>
            <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
              Learn React
            </a>

            <ReactTable data={this.props.data.users} columns={columns}/>

          </header>
        </div>
    )
  }
}



export default hoc(userQuery,usersSubscription,"users","usersChanged")(App)


