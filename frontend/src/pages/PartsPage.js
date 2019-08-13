import React from 'react'
import { gql } from 'apollo-boost'
// import ReactTable from 'react-table'
import { useQuery, useMutation } from '@apollo/react-hooks'
import 'react-table/react-table.css'
import Card from '../Components/Card'
// import Surface from '../ui/Surface'
import Paper from '@material-ui/core/Paper'
import _ from 'lodash'

import MaterialTable from 'material-table'

const columns = [
  { title: 'Part Name', field: 'name', initialEditValue: 'Part ' },
  { title: 'Number', field: 'number' , initialEditValue: '04-100-10'},
  { title: 'Status', field: 'status', initialEditValue: 'not_ordered'},
  { title: 'quantity', field: 'quantity', initialEditValue: 1 },
  { title: 'Total', field: 'total', initialEditValue: 2 }
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

const addPartMutation = gql`
  mutation ADD_PART($part:PartInput!) {
    partAdd(part: $part) {
      name
      number
      material
    }
  }
`

const deletePartMutation = gql`
  mutation DELETE_PART($part:PartInput!) {
    partDelete(part: $part) {
      name
    }
  }
`
const PartsPage = () => {
  const { data, loading, refetch } = useQuery(query)
  const [addPart, { data: addPartData }] = useMutation(addPartMutation)
  const [ deletePart ] = useMutation(deletePartMutation)

  const { parts = [] } = data || {}
  return (
    <MaterialTable
      isLoading={loading}
      columns={columns}
      data={parts}
      title="Parts Page"
      editable={{
        isEditable: rowData => true, // only name(a) rows would be editable
        isDeletable: rowData => true, // only name(a) rows would be deletable
        onRowAdd: async newData => {
          newData.quantity = parseInt(newData.quantity)
          newData.total = parseInt(newData.total)

          await addPart({
              variables: { part: newData } 
          })

          await refetch()
        },
        onRowUpdate: async (newData, oldData) => {

          const diff = difference(newData, oldData)
          
          console.log('newData:',newData)
          console.log('oldData:',oldData)
          console.log('diff:',diff)


        },
        onRowDelete: async oldData => {
          const { name, number } = oldData

          const part = {
            name, number
          }
          
          await deletePart({ 
            variables: { part } 
          })

          await refetch()
        }
      }}
    />
  )
}

export default PartsPage


function difference(object, base) {
	function changes(object, base) {
		return _.transform(object, function(result, value, key) {
			if (!_.isEqual(value, base[key])) {
				result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
			}
		});
	}
	return changes(object, base);
}