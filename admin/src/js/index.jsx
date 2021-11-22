import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { Route, Switch } from "react-router";
import { Link } from "react-router-dom";
import { combineReducers, createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import { Provider, connect } from "react-redux";
import thunk from "redux-thunk";
import { AppScreen, SigninScreen, OnboardingScreen } from "./screens";
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { API_PATH } from "./helpers";
import * as axios from "axios";
import moment from "moment";
import gql from "graphql-tag";
import "../less/index.less";

// Redux
const store = createStore(rootReducer, applyMiddleware(thunk));

// Setup GraphQL
const apollo = new ApolloClient({
    link: new HttpLink({ uri: `${API_PATH}/graphql` }),
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={apollo}>
            <HashRouter>
                <Switch>
                    <Route path="/signin" component={SigninScreen} />
                    <Route path="/onboarding" component={OnboardingScreen} />
                    <Route path="/app" component={AppScreen} />
                </Switch>
            </HashRouter>
        </ApolloProvider>
    </Provider>,
    document.getElementById("root")
);
