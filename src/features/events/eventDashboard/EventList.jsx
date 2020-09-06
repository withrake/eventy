// eslint-disable-next-line
import React from "react";
import EventListItem from "./EventListItem";

export default function EventList({ events, selectEvent, deleteEvent }) {
  /* props is not needed, {events} can be used instead */
  return (
    <>
      {events.map((event /* props.events is not needed due to {events] */) => (
        <EventListItem
          event={event}
          key={event.id}
          selectEvent={selectEvent}
          deleteEvent={deleteEvent}
        /> /* in our sampleData each event has an ID */
      ))}
    </>
  );
}
