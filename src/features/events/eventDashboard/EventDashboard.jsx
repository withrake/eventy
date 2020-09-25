import React from "react";
import { Grid } from "semantic-ui-react";
import EventList from "./EventList";
import { useSelector } from "react-redux";
// import LoadingComponent from '../../../app/layout/LoadingComponent';   //when we load, we show the loading indicator. once loading is done, we return the rest below. however, we need to remove the welcome to eventy text in the index.html, to avoid a flickering
import EventListItemPlaceholder from './EventListItemPlaceholder'; // shimmering loading effect while loading
import EventFilters from './EventFilters';

export default function EventDashboard() {
  const { events } = useSelector((state) => state.event);
  const {loading} = useSelector(state => state.async);


  return (
    <Grid>
      <Grid.Column width={10}>
      {loading &&
      <> 
        <EventListItemPlaceholder />
        <EventListItemPlaceholder />
      </>
      }
        <EventList events={events} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventFilters />
      </Grid.Column>
    </Grid>
  );
}
