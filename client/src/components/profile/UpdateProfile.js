import {
  Container,
  Form,
  Button,
  Header,
  Segment,
  Divider,
  Input,
  TextArea,
} from "semantic-ui-react"
import styled from "@emotion/styled"
import { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PT from 'prop-types'

import { FaUserAstronaut, FaYoutube, FaLinkedin, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { updateProfile } from "../../store/actions/profileAction";

const InitialForm = {
  company: '',
  website: '',
  location: '',
  bio: '',
  status: '',
  currentStatus: '',
  githubusername: '',
  skills: '',
  youtube: '',
  facebook: '',
  twitter: '',
  instagram: '',
  linkedin: '',
};

const statusOptions = [
  { key: 'developer', value: 'Developer', text: 'Developer' },
  { key: 'junior_developer', value: 'Junior Developer', text: 'Junior Developer' },
  { key: 'senior_developer', value: 'Senior Developer', text: 'Senior Developer' },
  { key: 'other', value: 'Other', text: 'Other' },
]

function UpdateProfile({ profile, updateProfile }) {
  const [isLoading, setLoading] = useState(false);
  const [showAdditionalLinks, setShowLinks] = useState(false);
  const [state, setState] = useState({
    form: InitialForm,
    errors: {}
  });

  useEffect(() => {
    if (profile.profile) {
      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        social,
      } = profile.profile;

      let socialData = {}, statusData = status, careerStatus = status;
      if (Object.keys(social).length > 0) {
        Object.keys(social).map(key => socialData[key] = social[key]);
      }
      if (!statusOptions.find(({ value }) => value === status)); {
        statusData = "Other";
      }

      const formData = {
        company,
        website,
        location,
        bio,
        githubusername,
        skills: skills.length > 0 ? skills.join(', ') : '',
        status: statusData,
        careerStatus,
        ...socialData
      }
      setState(prevState => ({
        ...prevState, form: { ...prevState.form, ...formData }
      }))
    }
  }, [profile.loading])

  const clearForm = () => setState(prevState => ({
    ...prevState,
    form: InitialForm
  }))

  const onChange = (e, { name, value }) => {
    if (name === "status") {
      return setState(prevState => ({
        ...prevState, form: {
          ...prevState.form,
          [name]: value,
          careerStatus: value !== "Other" ? '' : value,
        },
        errors: {
          ...prevState.errors,
          [name]: undefined,
        }
      }))
    }

    setState(prevState => ({
      ...prevState, form: {
        ...prevState.form,
        [e.target.name]: e.target.value
      },
      errors: {
        ...prevState.errors,
        [e.target.name]: undefined,
      }
    }))
  }

  const onSubmit = async e => {
    setLoading(true);
    e.preventDefault();
    setState(prevState => ({ ...prevState, errors: {} }))

    const { form } = state;
    if (form.careerStatus) {
      form.status = form.careerStatus;
    }
    if (profile.profile) {
      form.isUpdate = true;
    }
    delete form.careerStatus;
    updateProfile(form)
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

  // if (isAuthenticated) {
  //   console.log("UpdateProfile -> isAuthenticated", isAuthenticated)
  //   return <Redirect to="/home" />
  // }

  return (
    <Container>
      <StyledLogin>
        <Segment>
          <Header as="h1"><FaUserAstronaut />&nbsp; {profile.profile && "Update"} Profile</Header>
          <Header as="h5"> <span style={{ color: 'red' }}>*</span> Required</Header>
          <Divider />
          <Form loading={isLoading || profile.loading}>
            <Form.Dropdown
              selectOnNavigation={false}
              value={state.form.status || ''}
              label='Status'
              name='status'
              type='text'
              placeholder='Select your position status.'
              error={state.errors.status ? state.errors.status : null}
              clearable
              selection
              options={statusOptions}
              onChange={onChange}
            />
            {state.form.status === "Other" &&
              <Form.Input
                required
                placeholder="Type your status"
                name='careerStatus'
                onChange={onChange}
                value={state.form.careerStatus}
              />
            }
            <Form.Field
              required
              name='company'
              control={Input}
              value={state.form.company || ''}
              label='Company'
              placeholder='Enter your company name if you have it.'
              onChange={onChange}
              error={state.errors.company ? state.errors.company : null}
            />
            <Form.Field
              required
              name='website'
              control={Input}
              value={state.form.website || ''}
              label='Website'
              placeholder='Enter your company website.'
              onChange={onChange}
              error={state.errors.website ? state.errors.website : null}
            />
            <Form.Field
              required
              name='location'
              control={Input}
              value={state.form.location || ''}
              label='Location'
              placeholder='Enter your current location.'
              onChange={onChange}
              error={state.errors.location ? state.errors.location : null}
            />
            <Form.Field
              required
              name='skills'
              control={Input}
              value={state.form.skills || ''}
              label='Skills'
              placeholder='Enter your skills.'
              onChange={onChange}
              error={state.errors.skills ? state.errors.skills : null}
            />
            <Form.Field
              required
              name='githubusername'
              control={Input}
              value={state.form.githubusername || ''}
              label='Github username'
              placeholder='Write your github username.'
              onChange={onChange}
              error={state.errors.githubusername ? state.errors.githubusername : null}
            />
            <Form.Field
              name='bio'
              control={TextArea}
              value={state.form.bio || ''}
              label='Biography'
              placeholder='Write little bit about yourself.'
              onChange={onChange}
              error={state.errors.bio ? state.errors.bio : null}
            />

            <Button type="button" onClick={() => setShowLinks(!showAdditionalLinks)}>
              Social Network links
            </Button>
            {showAdditionalLinks && (
              <StyledAdditionalLinks>
                <Form.Field inline>
                  <span>
                    <FaYoutube />&nbsp; Youtube
                </span>
                  <Input placeholder='Youtube link' name="youtube" value={state.form.youtube} onChange={onChange} />
                </Form.Field>

                <Form.Field inline>
                  <span>
                    <FaFacebook />&nbsp; Facebook
                </span>
                  <Input placeholder='Facebook link' name="facebook" value={state.form.facebook} onChange={onChange} />
                </Form.Field>

                <Form.Field inline>
                  <span >
                    <FaTwitter />&nbsp; Twitter
                </span>
                  <Input placeholder='Twitter link' name="twitter" value={state.form.twitter} onChange={onChange} />
                </Form.Field>

                <Form.Field inline>
                  <span >
                    <FaInstagram />&nbsp; Instagram
                </span>
                  <Input placeholder='Instagram link' name="instagram" value={state.form.instagram} onChange={onChange} />
                </Form.Field>

                <Form.Field inline>
                  <span >
                    <FaLinkedin />&nbsp; Linkedin
                </span>
                  <Input placeholder='Linkedin Profile link' name="linkedin" value={state.form.linkedin} onChange={onChange} />
                </Form.Field>


              </StyledAdditionalLinks>
            )}

            {/* <Form.Field>
              <Checkbox label='I agree to the Terms and Conditions' />
            </Form.Field> */}
            <div style={{ padding: '25px 0' }}>
              <Button secondary type='submit' onClick={onSubmit}>
                {`${isLoading ? "Loading" : "Submit"}`}
              </Button>
            </div>
          </Form>
        </Segment>
      </StyledLogin>
    </Container>
  )
}

const StyledLogin = styled.div`
  /* margin: 10px 0; */
 
`;

const StyledAdditionalLinks = styled.div`
  margin: 20px 0;
  >div span{
    width: 100px;
    display: inline-block;
  }
`;

UpdateProfile.propTypes = {
  updateProfile: PT.func.isRequired,
  profile: PT.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.auth.errors,
  profile: state.profile,
})

export default connect(
  mapStateToProps, {
  updateProfile,
})(UpdateProfile)
