import React from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

function PrivateRoute({ component: Component, auth, ...rest }) {

  const authenticated = (props) => !auth.loading && !auth.isAuthenticated
    ? <Redirect to="/signin" />
    : <Component {...props} />

  return (
    <Route {...rest} render={authenticated} />
  )
}

PrivateRoute.propTypes = {
  auth: PT.object.isRequired
}

const mapState = state => ({ auth: state.auth })

export default connect(mapState)(PrivateRoute)
