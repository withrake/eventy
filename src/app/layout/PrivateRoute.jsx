import React from "react";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import UnauthModal from '../../features/auth/UnauthModal';

export default function PrivateRoute({
  component: Component,
  prevLocation,
  ...rest
}) {
  const { authenticated } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? <Component {...props} /> : <UnauthModal {...props} />
      }
    /> //passing in the rest of the properties, we're replacing our routes with these secured PrivateRoutes, we pass these props directly to the Router, e.g. history or location object
  );
}
