import {
  Container,
  Form,
  Button,
  Header,
  Segment,
  Divider,
  Input,
} from "semantic-ui-react"
import styled from "@emotion/styled"
import { useState } from "react"
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PT from 'prop-types'

import { setAlert } from '../../store/actions/alertAction';
import { signinUser } from '../../store/actions/authAction';

function Login({ loginUser, isAuthenticated }) {
  const [isLoading, setLoading] = useState(false);
  const [state, setState] = useState({
    form: {
      email: '',
      password: '',
    },
    errors: {}
  });

  const clearForm = () => setState(prevState => ({
    ...prevState,
    form: {
      email: '',
      password: '',
    }
  }))

  const onChange = e => {
    setState(prevState => ({
      ...prevState, form: {
        ...prevState.form,
        [e.target.name]: e.target.value
      }
    }))
  }

  const onSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    setState(prevState => ({ ...prevState, errors: {} }))

    const { email, password } = state.form;
    loginUser({ email, password })
      .then(() => {
        setLoading(false);
        clearForm();
      })
      .catch((err) => {
        setLoading(false);
        if (err && err.errors && err.errors.length > 0) {
          const { errors } = err;
          errors.map(({ msg, param }) => errors[param] = msg);
          setState(prevState => ({ ...prevState, errors }))
        }
      })
  }

  if (isAuthenticated) {
    return <Redirect to="/home" />
  }

  return (
    <Container>
      <StyledLogin>
        <Segment>
          <Header as="h1">Sign In</Header>
          <Header as="h4">Sign in to the web</Header>
          <Divider />
          <Form>
            <Form.Field
              required
              control={Input}
              value={state.form.email || ''}
              label='Email'
              name='email'
              type='email'
              placeholder='Enter your Email'
              error={state.errors.email ? state.errors.email : null}
              onChange={onChange}
            />
            <Form.Field
              required
              minLength={6}
              name='password'
              control={Input}
              value={state.form.password || ''}
              type="password"
              label='Password'
              placeholder='Enter Password'
              onChange={onChange}
              error={state.errors.password ? state.errors.password : null}
            />
            {/* <Form.Field>
              <Checkbox label='I agree to the Terms and Conditions' />
            </Form.Field> */}
            <Button type='submit' onClick={onSubmit} disabled={isLoading}>
              {`${isLoading ? "Loading" : "Submit"}`}
            </Button>
          </Form>
          <br />
          <p>
            Not have an account? &nbsp;
          <Link to="/signup">Sign up here!</Link>
          </p>
        </Segment>
      </StyledLogin>
    </Container>
  )
}

const StyledLogin = styled.div`
  /* margin: 10px 0; */
`;

Login.propTypes = {
  setAlert: PT.func.isRequired,
  isAuthenticated: PT.bool,
};

const mapStateToProps = state => ({
  errors: state.auth.errors,
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, {
  setAlert,
  loginUser: signinUser,
})(Login)
