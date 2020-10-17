import React, { useState } from "react";
import { Grid } from "semantic-ui-react";
import EventList from "./EventList";
import { useDispatch, useSelector } from "react-redux";
// import LoadingComponent from '../../../app/layout/LoadingComponent';   //when we load, we show the loading indicator. once loading is done, we return the rest below. however, we need to remove the welcome to eventy text in the index.html, to avoid a flickering
import EventListItemPlaceholder from "./EventListItemPlaceholder"; // shimmering loading effect while loading
import EventFilters from "./EventFilters";
import { listenToEventsFromFirestore } from "../../../app/firestore/firestoreService";
import { listenToEvents } from "../eventActions";
import useFirestoreCollection from "../../../app/hooks/useFirestoreCollection";
import EventsFeed from './EventsFeed';

export default function EventDashboard() {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.event);
  const { loading } = useSelector((state) => state.async);
  const { authenticated } = useSelector((state) => state.auth);
  const [predicate, setPredicate] = useState(
    new Map([
      ["startDate", new Date()],
      ["filter", "all"],
    ])
  ); // using local state. each element in the Map has a key and a value

  function handleSetPredicate(key, value) {
    setPredicate(new Map(predicate.set(key, value)));
  }

  useFirestoreCollection({
    query: () => listenToEventsFromFirestore(predicate),
    data: (events) => dispatch(listenToEvents(events)),
    deps: [dispatch, predicate], //we need to pass down predicate, as it has become a dependency of this hook useFirestoreCollection
  }); // since we used curly brackets for calling these objects, their listing order is unimportant

  return (
    <Grid>
      <Grid.Column width={10}>
        {loading && (
          <>
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
          </>
        )}
        <EventList events={events} />
      </Grid.Column>
      <Grid.Column width={6}>
          {authenticated &&
            <EventsFeed />
          }
        <EventFilters
          predicate={predicate}
          setPredicate={handleSetPredicate}
          loading={loading}
        />
      </Grid.Column>
    </Grid>
  );
}
