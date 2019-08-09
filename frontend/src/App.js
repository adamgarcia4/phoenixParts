import React from 'react'
import PropTypes from 'prop-types'
import PartsPage from './pages/PartsPage'
import Header from './Components/Header'

const App = props => {
  return (
    <div>
      <Header/>
      <PartsPage/>      
    </div>
  )
}

App.propTypes = {

}

export default App
