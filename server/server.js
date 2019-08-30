const { ApolloServer, gql } = require('apollo-server')
const { find, filter } = require('lodash')
const { RedisPubSub } = require('graphql-redis-subscriptions')
const { makeExecutableSchema } = require('graphql-tools')
const pubsub = new RedisPubSub()

const mongodb = require('mongodb')
const GraphQLJSON = require('graphql-type-json')

const { partModel } = require('./models')

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

{/* <Card title='Part 1' body='Some quick example text to build on the card title and make up the bulk of the cards content.'/> */}

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
    users: [User!]!
  }

  type Mutation {
    partAdd(part: PartInput!) : Part
    partDelete(part: PartInput!): Part
    partEdit(part: PartInput!): Part

    userAdd(user: UserInput!): User
  }
 
  input PartInput {
    _id: String
    name: String
    number: String
    status: AllowedStatus
    material: String
    description: String
    quantity: Int
    total: Int
  }

  input UserInput {
    _id: String
    name: String
  }

  type User {
    _id: String
    name: String
  }

  type Part {
    _id: String
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

const users = [
  {
    _id: '1',
    name: 'Adam'
  },
  {
    _id: '2',
    name: 'Maddy'
  }
]
// async (parent, args, context, info)
const start = client => {
  const db = {}

  const resolvers = {
    Query: {
      hi: () => 'hi',
      parts: async() => {
        const parts = await partModel.find()

        return parts
      },
      users: async() => {
        const users = await db.collection('users').find({}).toArray()
        return users
      }
    },
    Mutation: {
      partAdd: async (parent, args, context, info) => {
        const { part } = args
        
        const addedPart = await partModel.create(part)

        console.log('addedPart:',addedPart)
        
        return addedPart
      },
      partDelete: async (parent, args, context, info) => {
        const { part } = args

        const deletedPart = await db.collection('parts').findOneAndDelete({
          // TODO: Move _id to middleware
          _id: new mongodb.ObjectId(part._id)
        })

        return deletedPart
      },
      partEdit: async (parent, args, context, info) => {
        const { part } = args
        
        const { _id, ...partProps } = part

        const updatedPart = await db.collection('parts').findOneAndUpdate({ _id: new mongodb.ObjectID(_id) }, {$set: partProps}, {returnOriginal: false})

        return updatedPart.value
        
      },

      userAdd: async (parent, args, context, info) => {
        const { user } = args

        const addedUser = await db.collection('users').insertOne(user)

        return addedUser.ops[0]
      }
    }
  }

  // const usersCollection = client.db('sample').collection('users')

  // const usersStream = usersCollection.watch()

  // usersStream.on('change', ({ fullDocument }) => {

  //   pubsub.publish(USERS_CHANGED_TOPIC, { usersChanged: fullDocument })
  // })

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