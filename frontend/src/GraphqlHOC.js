import React from 'react'
import { graphql, compose } from 'react-apollo'
import _ from 'lodash';

const SubToGQL = (query, subscription, propName, subPropName) => (WrappedComponent) => {
    class App extends React.Component {
        constructor(props) {
            super(props)
            this.state = { data: [] }
        }

        componentWillUpdate(nextProps, nextState, nextContext) {
            const newData = nextProps.data[propName]

            if (!_.isEqual(newData, this.state.data)) {
                this.setState({ data: newData })
            }
        }

        componentDidMount() {
            if (!this.subscription) {
                let { subscribeToMore } = this.props.data
                this.subscription = [subscribeToMore(
                    {
                        document: subscription,
                        updateQuery: (previous, newest) => {
                            console.log("previous", previous[propName])
                            console.log("newest", newest.subscriptionData.data[subPropName])

                            const newData = newest.subscriptionData.data[subPropName]

                            previous[propName].forEach((usr, index) => {
                                if (usr._id === newData._id) {
                                    previous[propName][index] = newData;
                                }
                            });

                            this.setState({ data: previous.data })
                        },
                    })
                ]
            }
        }


        render() {
            return <WrappedComponent data={this.state.data} {...this.props} />
        }
    }

    return compose(
        graphql(query),
    )(App)
}


export default SubToGQL

