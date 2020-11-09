import React from 'react'
import { connect } from 'react-redux'
import PT from 'prop-types'
import { Message, Container } from 'semantic-ui-react'
import { removeAlert } from '../../store/actions/alertAction'

function Alert(props) {
  return props.alert ? (
    <div style={{ padding: '10px 0' }}>
      <Container>
        <Message
          onDismiss={props.removeAlert}
          error={props.alert.type === 'danger'}
          success={props.alert.type === 'success'}
          header={props.alert.title ? props.alert.title : ''}
          content={props.alert.msg || ''}
        />
      </Container>
    </div>
  ) : null
}

const mapState = state => ({
  alert: state.alert,
})

Alert.propTypes = {
  alert: PT.object
}
export default connect(mapState, { removeAlert })(Alert)
