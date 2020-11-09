import React, { useEffect, useState, Fragment } from 'react'
import { connect } from 'react-redux';
import { Redirect, useHistory, useLocation, NavLink } from 'react-router-dom';
import { Header, Container, Grid, Segment, Image, Icon, Divider } from 'semantic-ui-react';
import { profileRepos, clearProfile } from '../../store/actions/profileAction';
import Loading from '../layout/Loading';


function DetailDeveloper({ auth, profile, profileRepos, clearProfile }) {
  const location = useLocation();

  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      alert("You're not signed in! Sign in first to view profile");
      return <Redirect to="/signin" />
    }

    if (profile.profileDetail && profile.profileDetail.githubusername) {
      profileRepos(profile.profileDetail.githubusername);
    }

    return () => {
      clearProfile();
    }
  }, []);

  if (profile.loading && !profile.profileDetail) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }

  if (!profile.loading && !profile.profileDetail) {
    alert("Profile not found!")
    return <Redirect to="/developers" />
  }

  const { profileDetail: profileData } = profile;

  return (
    <Container>
      <Header as="h2">Detail Profile</Header>
      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column width={3}>
              <Image src={profileData && profileData.user.avatar} />
            </Grid.Column>
            <Grid.Column width={10}>
              <Header as="h5">{profileData.user.name}</Header>
              <Header as="h6">{profileData.bio}</Header>
              <Header.Subheader>
                Status: <b>{profileData.status}</b>
              </Header.Subheader>
              <Header.Subheader>
                Location: <b>{profileData.location}</b>
              </Header.Subheader>
              <br />
            </Grid.Column>
            {/* <Grid.Column width={3}>
              {data.skills.map(skill => <div><Icon name="checkmark" />{skill}</div>)}
            </Grid.Column> */}
          </Grid.Row>
        </Grid>
      </Segment>
      <Segment>
        <Grid>
          <Grid.Row>
            <Grid.Column width={12}>
              <Header as="h3">Skills</Header>
              <Header as="h4">
                {profileData.skills.map((skill) => (
                  <Fragment>
                    <span><Icon name="checkmark" />{skill}</span>
                    &nbsp;
                  </Fragment>
                ))}
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      {profile.repos.length > 0 &&
        <Segment>
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Header as="h3">Project Repos</Header>
              </Grid.Column>
            </Grid.Row>
            {
              profile.repos.map(repo => (
                <Fragment>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Header as="h4">{repo.name}</Header>
                      <a href={repo.html_url} target="__blank">Go to Repo</a>
                    </Grid.Column>
                  </Grid.Row>
                  <Divider />
                </Fragment>
              ))
            }
          </Grid>
        </Segment>}
    </Container>
  )
}
const mapState = state => ({ auth: state.auth, profile: state.profile })
export default connect(mapState, { profileRepos, clearProfile })(DetailDeveloper)
