const { ApolloServer, gql } = require('apollo-server')
const { find, filter } = require('lodash')
const { RedisPubSub } = require('graphql-redis-subscriptions')
const { makeExecutableSchema } = require('graphql-tools')
const pubsub = new RedisPubSub()

const GraphQLJSON = require('graphql-type-json')

// const client = require('./mongo').then(test1 => {
//   console.log('test1:',test1)

// })

// goal is to replace admin page.
/**
 *
 * Milestone 1
 * 1. Display users
 * 2. Change something in robo3T
 * 3. See update
 * 
 * Milestone 2
 * 1. Make a wrapper in the frontend consumer of this which mimicks
 *    the following API to some degree.
 * 
 * firebase.database().ref(`users/<userId>`).on('value', () => {})
 * firebase.database().ref(`users/<userId>`).once('value', () => {})
 * 
 *  
 */



// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

const trades = [
  {
    _id: '1',
    user_id: '5d492cbfd225f21bd0c4ae87',
    name: 'First trade evahhh!!!'
  },
  {
    _id: '2',
    user_id: '5d492cbfd225f21bd0c4ae87',
    name: 'Second trade only :('
  },
  {
    _id: '3',
    user_id: '5d492cbfd225f21bd0c4ae88',
    name: 'ANOTHER TRADE???'
  },
]
const schemaString = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  scalar JSON
  
  schema {
    query: Query
    # mutation: Mutation
    subscription: Subscription
  }

  type Trade {
    _id: String
    user_id: String
    name: String
  }

  type User {
    _id: String
    bank: String
    desk: String
    desk_id: String
    email: String
    first_name: String
    last_name: String
    my_trades: [Trade]
  }

  type Query {
    hi: String
    users: [User]
    trades: [Trade]
    # users: [JSON]
  }

  type Subscription {
    usersChanged: User
  }
`

const SOMETHING_CHANGED_TOPIC = 'something_changed'
const USERS_CHANGED_TOPIC = 'users_changed'

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const start = client => {
  const resolvers = {
    Query: {
      hi: () => 'hi',
      users: async (parent, args, context, info) => {
        const users = await client
          .db('sample')
          .collection('users')
          .find({})
          .toArray()

        return users
      },
      trades: async (parent, args, context, info) => {
        return trades
      }
    },
    Subscription: {
      usersChanged: {
        subscribe: () => pubsub.asyncIterator(USERS_CHANGED_TOPIC)
      }
    },
    User: {
      my_trades: (parent, args, context, info) => {
        const { _id } = parent
        console.log('parent:',parent)
        
        return trades.reduce((base, trade) => {
          if(trade.user_id === _id) base.push(trade)

          return base
        },[])
      }
    },
    JSON: GraphQLJSON
  }

  // setInterval(() => {
  //   const randomNumber = Math.floor(Math.random() * 100)
  //   pubsub.publish(SOMETHING_CHANGED_TOPIC, { somethingChanged: { id: randomNumber } })
  // }, 1000)

  const usersCollection = client.db('sample').collection('users')

  const usersStream = usersCollection.watch()

  usersStream.on('change', ({ fullDocument }) => {

    pubsub.publish(USERS_CHANGED_TOPIC, { usersChanged: fullDocument})
  })


  // In the most basic sense, the ApolloServer can be started
  // by passing type definitions (typeDefs) and the resolvers
  // responsible for fetching the data for those types.
  const jsSchema = makeExecutableSchema({
    typeDefs: schemaString,
    resolvers,

  })
  const server = new ApolloServer({ typeDefs: schemaString, resolvers })

  // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.

  server.listen().then(({ subscriptionsUrl, url }) => {
    console.log(`🚀 Server ready at ${url}`)
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`)
  })
}

module.exports = { start }