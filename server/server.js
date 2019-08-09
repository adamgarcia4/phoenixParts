const { ApolloServer, gql } = require('apollo-server')
const { find, filter } = require('lodash')
const { RedisPubSub } = require('graphql-redis-subscriptions')
const { makeExecutableSchema } = require('graphql-tools')
const pubsub = new RedisPubSub()

const GraphQLJSON = require('graphql-type-json')

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

{/* <Card title='Part 1' body='Some quick example text to build on the card title and make up the bulk of the cards content.'/> */}

const parts = [
  {
    name: 'Part 1',
    number: '04-100-001',
    status: 'not_ordered',
    material: '6061 T6',
    description: 'Some quick example text to build on the card title and make up the bulk of the cards content.',
    quantity: 2,
    total: 4
  },
  {
    name: 'Part 2',
    number: '04-100-002',
    material: '6061 T6',
    description: 'Some more text that I have just made up.',
    status: 'ordered',
    quantity: 1,
    total: 3
  },

]

const schemaString = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  enum AllowedStatus {
    not_ordered
    ordered
    delivered
  }

  type Query {
    hi: String
    parts: [Part!]!
  }
 
  type Part {
    name: String
    number: String
    status: AllowedStatus
    material: String
    description: String
    quantity: Int
    total: Int
    # date: 
  }
`

// const SOMETHING_CHANGED_TOPIC = 'something_changed'
// const USERS_CHANGED_TOPIC = 'users_changed'

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.

// async (parent, args, context, info)
const start = client => {
  const resolvers = {
    Query: {
      hi: () => 'hi',
      parts: () => {
        return parts
      }
    },
  }

  const usersCollection = client.db('sample').collection('users')

  const usersStream = usersCollection.watch()

  usersStream.on('change', ({ fullDocument }) => {

    pubsub.publish(USERS_CHANGED_TOPIC, { usersChanged: fullDocument })
  })

  // In the most basic sense, the ApolloServer can be started
  // by passing type definitions (typeDefs) and the resolvers
  // responsible for fetching the data for those types.
  const server = new ApolloServer({ typeDefs: schemaString, resolvers })

  server.listen().then(({ subscriptionsUrl, url }) => {
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
  })
}

module.exports = { start }