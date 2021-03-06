import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENTS,
  LISTEN_TO_EVENT_CHAT,
  CLEAR_COMMENTS,
  LISTEN_TO_SELECTED_EVENT,
  CLEAR_EVENTS,
} from "./eventConstants";

const initialState = {
  events: [],
  comments: [],
  moreEvents: true,
  selectedEvent: null,
};

export default function eventReducer(state = initialState, { type, payload }) {
  switch (type) {
    case CREATE_EVENT:
      return {
        ...state,
        events: [...state.events, payload], //in redux we want our states to be immutable, so not changeable. thus we do not use .push preferably. we use a spread operator instead =  […]
      };
    case UPDATE_EVENT:
      return {
        ...state,
        events: [
          ...state.events.filter((evt) => evt.id !== payload.id),
          payload,
        ], //this is returning an array of all the events except the ones we're updating, and then we pass in an additional event in the array (payload)
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: [...state.events.filter((evt) => evt.id !== payload)], // here we do not add a payload and the payload IS the event ID
      };
    case FETCH_EVENTS:
      return {
        ...state,
        events: [...state.events, ...payload.events], //the events accumulate inside our eventdashboard by this, i.e. they add up on the page
        moreEvents: payload.moreEvents,
      };
    case LISTEN_TO_EVENT_CHAT:
      return {
        ...state,
        comments: payload,
      };
      case CLEAR_COMMENTS:
        return {
          ...state,
          comments: [],
        }
      case LISTEN_TO_SELECTED_EVENT:
        return {
          ...state,
          selectedEvent: payload,
        }
        case CLEAR_EVENTS:
          return {
            ...state,
            events: [],
            moreEvents: true,
          }
    default:
      return state;
  }
}
