import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export default function LoadingComponent({inverted = true, content = 'Loading...'}) {
    return ( //the DIMMER gives a dark background
        <Dimmer inverted={inverted} active={true}>
            <Loader content={content}/>
        </Dimmer>
    )
}