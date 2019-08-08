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


let myUsers


// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const schemaString = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  scalar JSON
  
  schema {
    query: Query
    # mutation: Mutation
    subscription: Subscription
  }

  type User {
    bank: String
    desk: String
    desk_id: String
    email: String
    first_name: String
    last_name: String
    uid: String
    _id:String
  }

  type Query {
    hi: String
    users: [User]
    
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
      }
    },
    Subscription: {
      usersChanged: {
        subscribe: () => pubsub.asyncIterator(USERS_CHANGED_TOPIC)
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

    pubsub.publish(USERS_CHANGED_TOPIC, { usersChanged: fullDocument })
  })


  const realtimeUsersListener = async () => {
    myUsers = await usersCollection.find({}).toArray()

    usersStream.on('change', ({ fullDocument }) => {
      myUsers.forEach((user, index) => {
        if (user.uid === fullDocument.uid) {
          myUsers[index] = fullDocument;
        }
      });
    })
  }

  realtimeUsersListener().then()



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
    console.log(`Server ready at ${url}`)
    console.log(`Subscriptions ready at ${subscriptionsUrl}`)
  })
}

module.exports = { start }