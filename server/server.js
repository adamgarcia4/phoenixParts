const { ApolloServer, gql } = require('apollo-server')
const { find, filter } = require('lodash')
const { RedisPubSub } = require('graphql-redis-subscriptions')
const { makeExecutableSchema } = require('graphql-tools')
const pubsub = new RedisPubSub()

const mongodb = require('mongodb')

const GraphQLJSON = require('graphql-type-json')

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
  }

  type Mutation {
    partAdd(part: PartInput!) : Part
    partDelete(part: PartInput!): Part
    partEdit(part: PartInput!): Part
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

// async (parent, args, context, info)
const start = client => {
  const db = client.db('test')

  const resolvers = {
    Query: {
      hi: () => 'hi',
      parts: async() => {
        const parts = await db.collection('parts').find({}).toArray()

        return parts
      }
    },
    Mutation: {
      partAdd: async (parent, args, context, info) => {
        const { part } = args
        
        const addedPart = await db.collection('parts').insertOne(part)

        return addedPart.ops[0]
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
        
      }
    }
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