import React, { useState, useEffect, Fragment } from 'react'
import { Menu, Container } from 'semantic-ui-react'
import styled from '@emotion/styled'
import { NavLink, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FaSignOutAlt, FaCode, FaDev } from 'react-icons/fa'

import { signout } from '../../store/actions/authAction';

function Navbar({ isAuthenticated, signout }) {
  const [active, setActive] = useState('/');
  const { pathname } = useLocation();
  useEffect(() => {
    setActive(pathname);
  }, [pathname])

  const linkStyle = { color: 'rgba(0,0,0,.95)' };

  const authLinks = (
    <Fragment>
      <Menu.Item onClick={signout}>
        <FaSignOutAlt />&nbsp;
        <span>Logout</span>
      </Menu.Item>
    </Fragment>
  );

  const guestLinks = (
    <Fragment>
      <NavLink to="/signup" style={linkStyle}>
        <Menu.Item active={active === "/signup"} link>
          Sign up
      </Menu.Item>
      </NavLink>
      <NavLink to="/signin" style={linkStyle}>
        <Menu.Item active={active === "/signin"} link>
          Sign in
      </Menu.Item>
      </NavLink>
    </Fragment>
  )

  return (
    <StyledNavbar >
      <Container>
        <Menu secondary>
          <NavLink to={isAuthenticated ? "/home" : "/"} style={linkStyle}>
            <Menu.Item active={false} link>
              <FaCode />
              <StyledTitle>Dev Portfolios</StyledTitle>
            </Menu.Item>
          </NavLink>
          <Menu.Menu position='right'>
            {/* <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item> */}
            <NavLink to="/developers" style={linkStyle}>
              <Menu.Item active={active === "/developers"} link>
                <FaDev />&nbsp;
              Developers
          </Menu.Item>
            </NavLink>
            {isAuthenticated
              ? authLinks
              : guestLinks}
          </Menu.Menu>
        </Menu>
      </Container>
    </StyledNavbar>
  );
}

const StyledNavbar = styled.div`
  background-color: #f5f5f5;
  box-shadow: 2px -12px 8px 11px black;
  padding: 5px;
`

const StyledTitle = styled.span`
  padding: 0px 5px;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
`


Navbar.propTypes = {
  isAuthenticated: PT.bool,
  signout: PT.func.isRequired
}

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapState, { signout })(Navbar)
