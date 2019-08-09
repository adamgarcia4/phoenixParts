import React from 'react'
import { gql } from 'apollo-boost'
// import ReactTable from 'react-table'
import { useQuery } from '@apollo/react-hooks'
import 'react-table/react-table.css'
import Card from '../Components/Card'
import Surface from '../ui/Surface'
import MaterialTable from 'material-table'

const columns = [
  { title: "Part Name", field: "name" },
  { title: "Number", field: "number" },
  { title: "Status", field: "status" },
  { title: "quantity", field: "quantity" },
  { title: "Total", field: "total" },
]
const query = gql`
  {
    parts {
      name
      number
      status
      quantity
      total
    }
  }
`
const PartsPage = () => {
  const { data, loading } = useQuery(query)

  const Elem = () => {
    return (
    <div className="container">
      <Surface>
      <MaterialTable
          isLoading={loading}
          columns={columns}
          data={data.parts}
          title="Parts Page"
        />
      </Surface>
    </div>
    )
  }
  return (
      <Elem/>
  )
}

export default PartsPage
