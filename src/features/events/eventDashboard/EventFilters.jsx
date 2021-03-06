import React from "react";
import { Header, Menu } from "semantic-ui-react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux";

export default function EventFilters({ setPredicate, predicate, loading }) {
  const { authenticated } = useSelector((state) => state.auth);
  return (
    <>
      {authenticated &&
      <Menu vertical size='large' style={{ width: "100%" }}>
        <Header icon='filter' attached color='teal' content='Filters' />
        <Menu.Item
          content='All Events'
          active={predicate.get("filter") === "all"}
          onClick={() => setPredicate("filter", "all")}
          disabled={loading} //this item is disabled, if we're loading, to avoid overloading and misusage of filters
        />
        <Menu.Item
          content="I'm going"
          active={predicate.get("filter") === "isGoing"}
          onClick={() => setPredicate("filter", "isGoing")}
          disabled={loading}
        />
        <Menu.Item
          content="I'm hosting"
          active={predicate.get("filter") === "isHost"}
          onClick={() => setPredicate("filter", "isHost")}
          disabled={loading}
        />
      </Menu>}
      <Header icon='calendar' attached color='teal' content='Select date' />
      <Calendar
        onChange={(date) => setPredicate("startDate", date)}
        value={predicate.get("startDate") || new Date()} //new Date will be "today's date"
        tileDisabled={() => loading} //avoid the user to click to many things via this callback to loading
      />
    </>
  );
}
