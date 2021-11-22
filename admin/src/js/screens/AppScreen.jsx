import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router";
import { BrowserRouter, HashRouter } from "react-router-dom";
import moment from "moment";
import { CalendarPage, TransactionsPage, ContactsPage } from "../pages";
import {
    NotificationComponent,
    AvatarComponent,
    NavComponent,
    AccountComponent,
    OnboardingComponent,
} from "../components";
import * as axios from "axios";
import {
    currentAuthenticatedUser,
    API_PATH,
    deleteCookie,
    getCookie,
} from "../helpers";
import { error, events, account, calendar, tags, contacts } from "../actions";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            token: null,
        };
    }

    componentDidMount() {
        this.setState({
            loading: true,
        });

        currentAuthenticatedUser()
            .then((user) => {
                const { payload, token } = user;

                this.hydrate(payload, token);
            })
            .catch((error) => {
                this.props.history.push("/");
            });
    }

    hydrate(id, token) {
        axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer: ${token}`,
            },
            data: JSON.stringify({
                query: `
                    query User($id: String!) {
                        tags {
                            name
                        }
                        contacts(id: $id) {
                            _id
                            user {
                                _id
                                name
                            }
                            contact {
                                _id
                                name
                            }
                        }
                        events(id: $id) {
                            _id
                            notes
                            start
                            end
                            processed
                            owner {
                                _id
                                image
                                color
                                title
                                name
                            }
                            expert {
                                _id
                                image
                                color
                                title
                                name
                            }
                            attendees {
                                status
                                user {
                                    _id
                                    color
                                    name
                                    image
                                    title
                                }
                            }
                        }
                        user(id: $id) {
                            _id
                            tags {
                                name
                            }
                            descriptors
                            token
                            name
                            description
                            timezone
                            image
                            title
                            calendar {
                                _id
                                start
                                end
                                interval
                                daybreak
                                days
                                timezone
                                address
                                location {
                                    coordinates
                                    type
                                }
                                rate
                            }
                        }
                    }
                `,
                variables: {
                    id,
                },
            }),
        })
            .then((response) => {
                const { events, user, tags, contacts } = response.data.data;

                if (!user) {
                    alert("Please login");
                    deleteCookie("jwt");
                    this.props.history.push("/");
                    return;
                }

                if (!user.calendar) {
                    alert("Please onboard");
                    this.props.history.push("/onboarding");
                    deleteCookie("jwt");
                    return;
                }
                this.props.hydrateEvents(events);
                this.props.hydrateCalendar(user.calendar);
                this.props.hydrateTags(tags);
                this.props.hydrateContacts(contacts);
                this.props.hydrateAccount({
                    _id: user._id,
                    name: user.name,
                    description: user.description,
                    tags: user.tags,
                    token: user.token,
                    image: user.image,
                    title: user.title,
                    timezone: user.timezone,
                });

                this.setState({
                    loading: false,
                });
            })
            .catch((error) => {
                deleteCookie("jwt");
                this.props.history.push("/");
                this.props.hydrateError("Error fetching user");
            });
    }

    render() {
        return (
            <div className="layout">
                <NotificationComponent />
                <NavComponent />
                <AccountComponent history={this.props.history} />
                <Switch>
                    <Route
                        exact
                        path="/app/calendar"
                        render={({ history }) => <CalendarPage />}
                    />
                    <Route
                        exact
                        path="/app/contacts"
                        render={({ history }) => <ContactsPage />}
                    />
                    <Route
                        exact
                        path="/app/transactions"
                        render={({ history }) => <TransactionsPage />}
                    />
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    account: state.account,
});

const mapDispatchToProps = (dispatch) => ({
    hydrateError: (payload) => {
        dispatch(error(payload));
    },

    hydrateTags: (payload) => {
        dispatch(tags(payload));
    },

    hydrateEvents: (payload) => {
        dispatch(events(payload));
    },

    hydrateContacts: (payload) => {
        dispatch(contacts(payload));
    },

    hydrateAccount: (payload) => {
        dispatch(account(payload));
    },

    hydrateCalendar: (payload) => {
        dispatch(calendar(payload));
    },
});

export const AppScreen = connect(mapStateToProps, mapDispatchToProps)(App);
