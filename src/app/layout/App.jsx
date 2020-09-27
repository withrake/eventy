// eslint-disable-next-line
import React from "react";
import EventDashboard from "../../features/events/eventDashboard/EventDashboard";
import NavBar from "../../features/nav/NavBar";
import { Container } from "semantic-ui-react";
import { Route, useLocation } from "react-router-dom";
import EventDetailedPage from "../../features/events/eventDetailed/EventDetailedPage";
import EventForm from "../../features/events/eventForm/EventForm";
import HomePage from "../../features/home/HomePage";
import Sandbox from '../../features/sandbox/Sandbox';
import ModalManager from '../common/modals/ModalManager';
import {ToastContainer} from 'react-toastify';
import ErrorComponent from '../common/errors/ErrorComponent';

export default function App() {
  const {key} = useLocation();
  return (
    <>
      <ModalManager />
      <ToastContainer pisition='bottom-right' hideProgressBar/>
      <Route exact path='/' component={HomePage} />
      <Route
        path={"/(.+)"} //anything that has a / and something else we want to render differently
        render={() => (
          
          <>
            <NavBar />
            <Container className='main'>
              <Route exact path='/events' component={EventDashboard} />
              <Route exact path='/sandbox' component={Sandbox} />
              <Route path='/events/:id' component={EventDetailedPage} />{" "}
              {/* /:id leaves a place for the respective ID */}
              <Route path={['/createEvent', '/manage/:id']} component={EventForm} key={key} />
              <Route path='/error' component={ErrorComponent}/>
            </Container>
          </>
        )}
      />
    </>
  );
}
