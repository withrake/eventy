import React from "react";
import { Menu, Container, Button } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import SignedOutMenu from "./SignedOutMenu";
import SignedInMenu from "./SignedInMenu";
import { useSelector } from 'react-redux';

export default function NavBar({ setFormOpen }) {
    const {authenticated} = useSelector(state => state.auth)

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} exact to='/' header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 15 }} />
          eventy
        </Menu.Item>
        <Menu.Item as={NavLink} to='/events' name='Events' />
        <Menu.Item as={NavLink} to='/sandbox' name='Sandbox' />
        {authenticated /* if user is authenticated, the part behind && will be executed*/ && (
          <Menu.Item as={NavLink} to='/createEvent'>
            <Button positive inverted content='Create Event' />
          </Menu.Item>
        )}
        {authenticated ? (
          <SignedInMenu />
        ) : (
          <SignedOutMenu />
        )}{" "}
        {/* if user is authenticated, he sees signed in menu, else signed out*/}
      </Container>
    </Menu>
  );
}
