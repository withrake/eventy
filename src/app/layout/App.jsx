import React, {useState} from 'react';
import EventDashboard from '../../features/events/eventDashboard/EventDashboard';
import NavBar from '../../features/nav/NavBar';
import { Container } from 'semantic-ui-react';

export default function App() {
  const [formOpen, setFormOpen] = useState(false);
  return (
    <> {/*Fragments or divs are not needed here*/}
      <NavBar setFormOpen={setFormOpen}/>
      <Container className='main'>
        <EventDashboard formOpen={formOpen} setFormOpen={setFormOpen}/>
      </Container>
    </>
  );
}