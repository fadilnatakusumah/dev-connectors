import React, { useEffect, Fragment, useState } from 'react'
import { Container, Button, Icon, Header, Table, Label, Menu } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { FaUser, FaUserAstronaut } from 'react-icons/fa';
import PT from 'prop-types'
import dayjs from 'dayjs'

import { getCurrentProfile, deleteExperience } from '../../store/actions/profileAction';
import Loading from '../layout/Loading';
import ModalExperience from '../profile/ModalExperience';
import ModalEducation from '../profile/ModalEducation';

function Home({ auth, profile, getCurrentProfile, deleteExperience }) {
  useEffect(() => {
    getCurrentProfile();
  }, []);

  const [showModalExperience, setModalExperience] = useState(false);
  const [showModalEducation, setModalEducation] = useState(false);

  const toggleModalExperience = (val) => val !== undefined ? setModalExperience(val) : setModalExperience(!showModalExperience);
  const toggleModalEducation = (val) => val !== undefined ? setModalEducation(val) : setModalEducation(!showModalEducation);

  if (!auth.user || !profile.profile && profile.loading) {
    return (
      <Container>
        <Loading />
      </Container>
    )
  }
  return (
    <Container>
      <h2><FaUserAstronaut />&nbsp; Hi, {auth && auth.user.name}</h2>
      {!profile.profile
        ? (
          <Fragment>
            <h4 >
              You seem you don't have profile yet. Please make it first.
            </h4>
            <NavLink to="/profile/create">
              <Button primary> <FaUser />  &nbsp;Make Profile</Button>
            </NavLink>
          </Fragment>
        )
        : (
          <Fragment>
            <div>
              <NavLink to="/profile/update">
                <Button>
                  <Icon name="user" />
                Edit Profile
              </Button>
              </NavLink>
              <ModalExperience
                open={showModalExperience}
                setModal={toggleModalExperience}
              >
                <Button>
                  <Icon name="black tie" />
                  Add Experience
                </Button>
              </ModalExperience>

              <ModalEducation
                open={showModalEducation}
                setModal={toggleModalEducation}
              >
                <Button>
                  <Icon name="university" />
                  Add Education
                </Button>
              </ModalEducation>
            </div>
            <br />
            <br />
            <div>
              <Header as="h3">My Experinces</Header>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Title</Table.HeaderCell>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2">Years</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {profile.profile.experience.length === 0
                    ? (
                      <Table.Row>
                        <Table.Cell colSpan="4" textAlign="center">
                          No data Experience
                        </Table.Cell>
                      </Table.Row>
                    )
                    : profile.profile.experience.map(experience => (
                      <Table.Row>
                        <Table.Cell>
                          {experience.current && (
                            <Label ribbon>
                              Current Job
                            </Label>
                          )}
                          {experience.title}
                        </Table.Cell>
                        <Table.Cell>{experience.company}</Table.Cell>
                        <Table.Cell>{dayjs(experience.from).format('DD-MM-YYYY')} - {experience.current ? "Now" : dayjs(experience.to).format('DD-MM-YYYY')}</Table.Cell>
                        <Table.Cell textAlign="center">
                          <Button color="red" onClick={() => {
                            if (window.confirm("You sure you want to delete this?")) {
                              deleteExperience(experience._id);
                            }
                          }}>Delete</Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
                {/* <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan='3'>
                      <Menu floated='right' pagination>
                        <Menu.Item as='a' icon>
                          <Icon name='chevron left' />
                        </Menu.Item>
                        <Menu.Item as='a'>1</Menu.Item>
                        <Menu.Item as='a'>2</Menu.Item>
                        <Menu.Item as='a'>3</Menu.Item>
                        <Menu.Item as='a'>4</Menu.Item>
                        <Menu.Item as='a' icon>
                          <Icon name='chevron right' />
                        </Menu.Item>
                      </Menu>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer> */}
              </Table>
            </div>
            <br />
            <br />
            <div>
              <Header as="h3">My Educations</Header>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Degree</Table.HeaderCell>
                    <Table.HeaderCell>School</Table.HeaderCell>
                    <Table.HeaderCell>Field of Study</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2">Years</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {profile.profile.education.length === 0
                    ? (
                      <Table.Row>
                        <Table.Cell colSpan="4" textAlign="center">
                          No data Education
                        </Table.Cell>
                      </Table.Row>
                    )
                    : profile.profile.education.map(education => (
                      <Table.Row>
                        <Table.Cell>
                          {education.current && (
                            <Label ribbon>
                              Current Study
                            </Label>
                          )}
                          {education.degree}
                        </Table.Cell>
                        <Table.Cell>{education.school}</Table.Cell>
                        <Table.Cell>{education.fieldofstudy}</Table.Cell>
                        <Table.Cell>{dayjs(education.from).format('DD-MM-YYYY')} - {education.current ? "Now" : dayjs(education.to).format('DD-MM-YYYY')}</Table.Cell>
                        <Table.Cell textAlign="center">
                          <Button color="red">Delete</Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
                {/* <Table.Footer>
                  <Table.Row>
                    <Table.HeaderCell colSpan='3'>
                      <Menu floated='right' pagination>
                        <Menu.Item as='a' icon>
                          <Icon name='chevron left' />
                        </Menu.Item>
                        <Menu.Item as='a'>1</Menu.Item>
                        <Menu.Item as='a'>2</Menu.Item>
                        <Menu.Item as='a'>3</Menu.Item>
                        <Menu.Item as='a'>4</Menu.Item>
                        <Menu.Item as='a' icon>
                          <Icon name='chevron right' />
                        </Menu.Item>
                      </Menu>
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer> */}
              </Table>
            </div>
            <br />
            <br />
            <Button color="red">
              <Icon name="trash" />
              Delete profile</Button>
          </Fragment>
        )
      }
    </Container>
  )
}

Home.propTypes = {
  auth: PT.object.isRequired,
  profile: PT.object.isRequired,
  getCurrentProfile: PT.func.isRequired,
}

const mapState = state => ({
  auth: state.auth,
  profile: state.profile,
});

// mapDispatch = dispatch = () =>

export default connect(mapState, {
  getCurrentProfile,
  deleteExperience,
})(Home)
