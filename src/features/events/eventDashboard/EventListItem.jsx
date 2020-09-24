import React from "react";
import { Segment, Item, Icon, List, Button } from "semantic-ui-react";
import EventListAttendee from "./EventListAttendee";
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {deleteEvent} from '../eventActions';
import {format} from 'date-fns';

export default function EventListItem({ event }) {
  const dispatch = useDispatch();

  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image size='tiny' circular src={event.hostPhotoURL} />{" "}
            {/* via javascript we can enter the properties */}
            <Item.Content>
              <Item.Header content={event.title} />
              <Item.Description>Hosted by {event.hostedBy}</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <span>
          <Icon name='clock' /> {format(event.date, 'MMMM d, yyyy h:mm a')} 
          <Icon name='marker' /> {event.venue}
        </span>
      </Segment>
      <Segment secondary>
        <List horizontal>
          {event.attendees.map((attendee) => (
            <EventListAttendee key={attendee.id} attendee={attendee} />
          ))}
        </List>
      </Segment>
      <Segment clearing>
        {" "}
        {/* clears any previous floats*/}
        <div>{event.description}</div>
        <Button
          onClick={() => dispatch(deleteEvent(event.id))}
          color='red'
          floated='right'
          content='Delete'
        />
        <Button
          as={Link} to={`/events/${event.id}`} //semantic ui will work as a link, the `` will allow us template literals with javascript
          color='teal'
          floated='right'
          content='View'
        />
      </Segment>
    </Segment.Group>
  );
}
