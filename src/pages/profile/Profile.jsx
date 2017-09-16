import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'
import { Link } from 'react-router'
import { graphql, withApollo } from 'react-apollo'
import { profileGot } from '../../actions/auth'
import Card from '../../components/card/Card'
import fetchProfileQuery from 'AthenaSchema/queries/profileWithCollection.graphql'

import PhotoList from '../../components/photos/Photos'
import PageContainer from '../../components/PageContainer'
import Tab from '../../components/tab/Tab'
import Information from './Information'
import Separator from '../../components/Separator'

const AddButton = styled.div`
`

@connect(store => ({
  user: store.getIn(['profile', 'info'])
}), dispatch => ({
  syncUserInfo(info) { return dispatch(profileGot(info)) }
}))
@withApollo
class Profile extends React.PureComponent {


  constructor(props) {
    super(props)
    this.state = {
      collections: fromJS([])
    }
    this.variableFrom = 0
  }

  componentDidMount() {
    // 不能用自动加载的方式，需要整合 redux store
    if (this.props.user.get('id')) {
      return
    }
    this.setupProfile()
  }

  setupProfile() {
    this.props.client.query({
      query: fetchProfileQuery,
      variables: {
        id: this.props.params.id,
        from: this.variableFrom,
        size: 20
      }
    }).then(result => {
      // dispatch to user information
      // set to local collections
      const _collections = result.data.collections
      if (_collections && _collections.length !== 0) {
        this.setState({
          collections: this.state.collections.concat(result.data.collections)
        })
      }
      const user = result.data.users
      if (user && user.email) {
        this.props.syncUserInfo(user)
      }
    }).catch(err => {
      console.error(err)
    })
    this.variableFrom += 20
  }

  loadMore = () => {
    this.props.client.query({
      query: fetchProfileQuery,
      variables: {
        id: this.props.params.id,
        from: 0,
        size: 20
      }
    }).then(result => {
      const _collections = result.data.collections
      if (_collections && _collections.length !== 0) {
        this.setState({
          collections: this.state.collections.concat(result.data.collections)
        })
      }
    }).catch(err => {
      console.error(err)
    })
    // 可以重构一下，而且应该更新这个值在 async 内部
    this.variableFrom += 20
  }

  render() {
    const collectionBody = (
        <PhotoList
          loading={false}
          loadMore={this.loadMore}
          cells={this.state.collections.toJS()}
        />
    )
    return (
      <PageContainer>
        <Card isFar>
          <Information
            user={this.props.user}
          />
          <Separator />
          <AddButton>
            <Link to={"/profile/" + this.props.params.id + "/create"}>Create</Link>
          </AddButton>
          <Separator />
          <Tab
            tab={[{
              title: 'title',
              body: collectionBody
            }]}
          />
        </Card>
      </PageContainer>
    )
  }
}

export default Profile
