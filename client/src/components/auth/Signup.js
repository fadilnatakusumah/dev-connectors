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
import { signupUser } from '../../store/actions/authAction';

function Signup({ registerUser, isAuthenticated }) {
  const [isLoading, setLoading] = useState(false);
  const [state, setState] = useState({
    form: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    errors: {}
  });

  const clearForm = () => setState(prevState => ({
    ...prevState,
    form: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
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
    if (state.form.password !== state.form.confirmPassword) {
      setLoading(false);
      setState(prevState => ({
        ...prevState, errors: {
          confirmPassword: 'Confirm Password is not the same as Password'
        }
      }));
      return;
    }

    const { name, email, password } = state.form;
    registerUser({ name, email, password })
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
      <StyledRegister>
        <Segment>
          <Header as="h1">Sign Up</Header>
          <Header as="h4">Create account</Header>
          <Divider />
          <Form>
            <Form.Field
              required
              control={Input}
              value={state.form.name || ''}
              label='Name'
              name='name'
              type='text'
              placeholder='Enter your Name'
              error={state.errors.name ? state.errors.name : null}
              onChange={onChange}
            />
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
            <Form.Field
              minLength={6}
              name='confirmPassword'
              control={Input}
              value={state.form.confirmPassword || ''}
              type="password"
              label='Confirm Password'
              placeholder='Confirm Password'
              onChange={onChange}
              error={state.errors.confirmPassword ? state.errors.confirmPassword : null}
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
            Already have an account? &nbsp;
          <Link to="/signin">Sign in here!</Link>
          </p>
        </Segment>
      </StyledRegister>
    </Container>
  )
}

const StyledRegister = styled.div`
  /* margin: 10px 0; */
`;

Signup.propTypes = {
  alert: PT.object,
  setAlert: PT.func.isRequired,
  isAuthenticated: PT.bool
};

const mapStateToProps = state => ({
  isAuthenticated : state.auth.isAuthenticated ,
  errors: state.auth.errors,
})

export default connect(mapStateToProps, {
  setAlert,
  registerUser: signupUser,
})(Signup)
