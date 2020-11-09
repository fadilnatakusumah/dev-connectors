import React from 'react'
import styled from '@emotion/styled'
import { Button } from 'semantic-ui-react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PT from 'prop-types';

function Landing({ isAuthenticated }) {

  if (isAuthenticated) {
    return <Redirect to="/home" />
  }

  return (
    <StyledLanding>
      <div className="landing-center">
        <h1>Dev Portofolios</h1>
        <h4>Sharing and connecting developers</h4>
        <div>
          <Link to="/signup">
            <Button primary>Sign Up</Button>
          </Link>
          <Link to="/signin">
            <Button secondary>Sign in</Button>
          </Link>
        </div>
      </div>
    </StyledLanding>
  )
}

const StyledLanding = styled.div`
  min-width: 100vw;
  min-height: 94vh;
  /* position: fixed;
  z-index: -1;
  left: 0; top:0;
  right:0; */
  background-image: url('https://mewallpaper.com/thumbnail/abstract/3513-white-wall-with-plants-wallpaper-file-hd.jpg');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  .landing-center{
    min-width: 70vw;
    min-height: 70vh;
    display: flex;
    flex-direction:column;
    justify-content:center;
    align-items: center;

    h1,h4{ margin: 10px; line-height:0; padding: 0;};
    h1{font-size: 50px;}
    h4{margin: 20px;}
  }
`

Landing.propTypes = {
  isAuthenticated: PT.bool.isRequired
}

const mapState = state => ({
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapState)(Landing)
