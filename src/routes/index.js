import React, { useState, useEffect } from "react";
// import { BrowserRouter, Switch } from "react-router-dom";
import {
  Login,
  Signup,
  Dashboard,
  MenuDetail,
  SearchMenu,
} from "../containers";
// import { Route } from "react-router-dom";
import Amplify from "aws-amplify";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};
const Routes = () => {
  useEffect(() => {
    Amplify.configure({
      Auth: {
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
      },
    });
  });

  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route restricted={false} exact path={"/"} component={Login} />
          <Route restricted={false} exact path={"/signup"} component={Signup} />
          <Route
            restricted={false}
            exact
            path={"/menu/:menuId"}
            component={MenuDetail}
          />
          <Route
            restricted={false}
            exact
            path={["/search", "/search/:item"]}
            component={SearchMenu}
          />
          <PrivateRoute exact path={"/dashboard"} component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </>
  );
};
export default Routes;
