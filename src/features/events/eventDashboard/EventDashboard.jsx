import React, { useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import EventList from "./EventList";
import { useDispatch, useSelector } from "react-redux";
// import LoadingComponent from '../../../app/layout/LoadingComponent';   //when we load, we show the loading indicator. once loading is done, we return the rest below. however, we need to remove the welcome to eventy text in the index.html, to avoid a flickering
import EventListItemPlaceholder from "./EventListItemPlaceholder"; // shimmering loading effect while loading
import EventFilters from "./EventFilters";
import { clearEvents, fetchEvents } from "../eventActions";
import EventsFeed from "./EventsFeed";

export default function EventDashboard() {
  const limit = 2;
  const dispatch = useDispatch();
  const { events, moreEvents } = useSelector((state) => state.event);
  const { loading } = useSelector((state) => state.async);
  const { authenticated } = useSelector((state) => state.auth);
  const [lastDocSnapshot, setLastDocSnapshot] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [predicate, setPredicate] = useState(
    new Map([
      ["startDate", new Date()],
      ["filter", "all"],
    ])
  ); // using local state. each element in the Map has a key and a value

  function handleSetPredicate(key, value) {
    dispatch(clearEvents());
    setLastDocSnapshot(null); //we want to reset our filter completely when hitting our last document snapshot
    setPredicate(new Map(predicate.set(key, value)));
  } //when we change the predicate then hit our dependency inside our useEffect, we then call what is inside our useEffect

  useEffect(() => {
    setLoadingInitial(true);
    dispatch(fetchEvents(predicate, limit)).then((lastVisible) => {
      setLastDocSnapshot(lastVisible);
      setLoadingInitial(false);
    });
    return () => {
      dispatch(clearEvents()) //when we unmount our components, we set it back to initial state
    }
  }, [dispatch, predicate]);

  function handleFetchNextEvents() {
    dispatch(fetchEvents(predicate, limit, lastDocSnapshot)).then(
      (lastVisible) => {
        setLastDocSnapshot(lastVisible);
      }
    );
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        {loadingInitial && (
          <>
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
          </>
        )}
        <EventList
          events={events}
          getNextEvents={handleFetchNextEvents}
          loading={loading}
          moreEvents={moreEvents}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {authenticated && <EventsFeed />}
        <EventFilters
          predicate={predicate}
          setPredicate={handleSetPredicate}
          loading={loading}
        />
      </Grid.Column>
      <Grid.Column width={10}>
          <Loader active={loading} />
      </Grid.Column>
    </Grid>
  );
}
