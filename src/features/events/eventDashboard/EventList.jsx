import React from 'react';
import EventListItem from './EventListItem';

export default function EventList({events}) { /* props is not needed, {events} can be used instead */
    return ( 
    <>
        {events.map(event => ( /* props.events is not needed due to {events] */
            <EventListItem event={event} key={event.id}/> /* in our sampleData each event has an ID */
        ))}
    </>
    )
}