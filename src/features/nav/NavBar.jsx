import React, { useState } from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink, useHistory } from "react-router-dom";
import SignedOutMenu from "./SignedOutMenu";
import SignedInMenu from "./SignedInMenu";

export default function NavBar({ setFormOpen }) {
    const history = useHistory(); // we got this from react router dom to get access to history and push people to routes
    const [authenticated, setAuthenticated] = useState(false);

    function handleSignOut() {
        setAuthenticated(false);
        history.push('/');
    }

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} exact to='/' header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 15 }} />
          eventy
        </Menu.Item>
        <Menu.Item as={NavLink} to='/events' name='Events' />
        {authenticated /* if user is authenticated, the part behind && will be executed*/ && (
          <Menu.Item as={NavLink} to='/createEvent'>
            <Button positive inverted content='Create Event' />
          </Menu.Item>
        )}
        {authenticated ? (
          <SignedInMenu signOut={handleSignOut} />
        ) : (
          <SignedOutMenu setAuthenticated={setAuthenticated} />
        )}{" "}
        {/* if user is authenticated, he sees signed in menu, else signed out*/}
      </Container>
    </Menu>
  );
}
