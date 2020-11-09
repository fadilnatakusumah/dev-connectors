import React, { useEffect } from 'react'
import { Header, Container, Icon, Grid, Image, Segment, Button } from 'semantic-ui-react'
import PT from 'prop-types'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { getProfiles, selectProfile } from '../../store/actions/profileAction'

function Developers({ profile, getProfiles, selectProfile }) {
  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <Container>
      <Header as="h2">Developers</Header>
      <Header as="h4">
        <Icon name="connectdevelop" />
        Connect to other developers
      </Header>
      {profile.profiles.length > 0 ? (
        profile.profiles.map(data => (
          <Segment>
            <Grid>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Image src={data.user.avatar} />
                </Grid.Column>
                <Grid.Column width={10}>
                  <Header as="h5">{data.user.name}</Header>
                  <Header.Subheader>
                    Status: <b>{data.status}</b>
                  </Header.Subheader>
                  <Header.Subheader>
                    Location: <b>{data.location}</b>
                  </Header.Subheader>
                  <br />
                  <NavLink to={`/profile/detail/${data.user._id}`}>
                    <Button primary onClick={() => {
                      selectProfile(data)
                    }}>View Profile</Button>
                  </NavLink>
                </Grid.Column>
                <Grid.Column width={3}>
                  {data.skills.map(skill => <div><Icon name="checkmark" />{skill}</div>)}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        ))
      )
        : <Header as="h3">No developer data</Header>
      }
    </Container>
  )
}

Developers.propTypes = {
  profile: PT.object.isRequired,
  auth: PT.object.isRequired,
  getProfiles: PT.func.isRequired,
  selectProfile: PT.func.isRequired
}

const mapState = state => ({
  profile: state.profile,
  auth: state.auth,
})

export default connect(mapState, { getProfiles, selectProfile })(Developers)
