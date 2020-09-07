import React from 'react';
import { Segment, Container, Image, Header, Button, Icon } from 'semantic-ui-react';

export default function HomePage({history}) {
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container>
                <Header as ='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' style={{marginBottom: 12}} />
                    eventy
                </Header>
                <Button onClick={() => history.push('/events')} size='huge' inverted> {/* via the history we can push the page and reroute */}
                    Get started
                    <Icon name='right arrow' inverted />
                </Button>
            </Container>
        </Segment>
    )
}