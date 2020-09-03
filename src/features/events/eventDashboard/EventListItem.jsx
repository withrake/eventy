import React from 'react';
import { Segment, Item, Icon, List, Button } from 'semantic-ui-react';
import EventListAttendee from './EventListAttendee'

export default function EventListItem({event}) { {/* due to {event} we have access to each property in an event */}
    return ( 
        <Segment.Group>
            <Segment>
              <Item.Group>
                <Item>
                    <Item.Image size='tiny' circular src={event.hostPhotoURL}/> {/* via javascript we can enter the properties */}
                    <Item.Content>
                        <Item.Header content={event.title} />
                        <Item.Description>
                            Hosted by {event.hostedBy}
                        </Item.Description>
                    </Item.Content>
                </Item>
               </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock'/> {event.date}
                    <Icon name='marker'/> {event.venue}
                </span>
            </Segment>
            <Segment secondary>
                <List horizontal>
                    {event.attendees.map(attendee => (
                        <EventListAttendee key={attendee.id} attendee={attendee} />
                    ))}
                </List>
            </Segment>
            <Segment clearing> {/* clears any previous floats*/}
                <div>{event.description}</div>
                <Button color='teal' floated='right' content='View'/>
            </Segment>
        </Segment.Group>
    )
}