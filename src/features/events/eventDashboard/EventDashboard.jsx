// eslint-disable-next-line
import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import EventList from "./EventList";
import EventForm from "../eventForm/EventForm";
import { sampleData } from "../../../app/api/sampleData";
{
  /* named functions need curly brackets */
}

export default function EventDashboard({ formOpen, setFormOpen, selectEvent, selectedEvent }) {
  const [events, setEvents] = useState(sampleData);

  function handleCreateEvent(event) {
    setEvents([...events, event]); //this creates an array "events" and adds a new event to it everytime we create one with our form
  }

  function handleUpdateEvent(updatedEvent) {
      setEvents(events.map(evt => evt.id === updatedEvent.id ? updatedEvent : evt));
      selectEvent(null);
  }

  function handleDeleteEvent(eventId) {
    setEvents(events.filter(evt => evt.id !== eventId));
  }
  

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventList events={events} selectEvent={selectEvent} deleteEvent={handleDeleteEvent} />
      </Grid.Column>
      <Grid.Column width={6}>
        {formOpen && (
          <EventForm
            setFormOpen={setFormOpen}
            setEvents={setEvents}
            createEvent={handleCreateEvent}
            selectedEvent={selectedEvent}
            updateEvent={handleUpdateEvent}
            key={selectedEvent ? selectedEvent.id : null} //check if null, if not use id, or set null. this allows us to swap the formular block on the right without pressing cancel every time
          />
        )}
      </Grid.Column>
    </Grid>
  );
}
