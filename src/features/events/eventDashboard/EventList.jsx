// eslint-disable-next-line
import React from "react";
import EventListItem from "./EventListItem";
import InfiniteScroll from "react-infinite-scroller";

export default function EventList({
  events,
  getNextEvents,
  loading,
  moreEvents,
}) {
  /* props is not needed, {events} can be used instead */
  return (
    <>
      {events.length !== 0 && (
        <InfiniteScroll
        pageStart={0}
        loadMore={getNextEvents}
        hasMore={!loading && moreEvents}
        initialLoad={false}
        >
          {events.map((
            event /* props.events is not needed due to {events] */
          ) => (
            <EventListItem
              event={event}
              key={event.id}
            /> /* in our sampleData each event has an ID */
          ))}
        </InfiniteScroll>
      )}
    </>
  );
}
