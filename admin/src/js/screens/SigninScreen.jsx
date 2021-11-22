import React from "react";
import { connect } from "react-redux";
import { Input, Select, Spin } from "antd";
import {
    HeadingComponent,
    SectionHeadingComponent,
    GroupComponent,
    PopupComponent,
    ButtonComponent,
    TextButtonComponent,
} from "../components";
import { uiEvent } from "../actions";
import moment from "moment";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import {
    API_PATH,
    currentAuthenticatedUser,
    signIn,
    setCookie,
    deleteCookie,
} from "../helpers";
import * as axios from "axios";

const Option = Select.Option;

class Signin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            loading: null,
            email: "",
            password: "",
        };

        this.signin = this.signin.bind(this);
    }

    componentDidMount() {
        this.setState({
            loading: true,
        });

        currentAuthenticatedUser()
            .then((user) => {
                this.setState({
                    loading: null,
                });

                this.props.history.push("/app/calendar");
            })
            .catch((error) => {
                this.setState({
                    loading: null,
                });
            });
    }

    signin() {
        this.setState({
            loading: true,
        });

        axios({
            url: `${API_PATH}/login`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            data: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((result) => {
                // Set our cookie
                setCookie("jwt", result.data.token);

                // Remove the loading
                this.setState({
                    loading: null,
                });

                this.props.history.push("/app/calendar");
            })
            .catch((error) => {
                this.setState({
                    error: "User not found",
                    loading: null,
                });
            });
    }

    render() {
        return (
            <div className="signin">
                <div className="container">
                    <div style={{ padding: 40 }}>
                        <div style={{ marginBottom: 30 }}>
                            <img src="./assets/logo.png" height="20" />
                        </div>

                        <p>
                            Welcome to Wami! In order for you to be a certified
                            Wami expert, we need to link your existing account.
                            Remember, you need to first sign up on the mobile
                            app - so if you haven't done that yet, do so now -
                            and then come back here to continue.
                        </p>

                        {this.state.error && (
                            <p className="warning">{this.state.error}</p>
                        )}

                        <SectionHeadingComponent title="Login" align="left" />

                        <Input
                            size="large"
                            placeholder="Email"
                            value={this.state.email}
                            onChange={({ target }) =>
                                this.setState({ email: target.value })
                            }
                            style={{ marginBottom: 5 }}
                        />

                        <Input
                            size="large"
                            placeholder="Password"
                            type="password"
                            value={this.state.password}
                            onChange={({ target }) =>
                                this.setState({ password: target.value })
                            }
                        />

                        <GroupComponent style={{ marginTop: 20 }}>
                            {this.state.loading && <Spin size="large" />}

                            {!this.state.loading && (
                                <ButtonComponent
                                    action={this.signin}
                                    text="Login"
                                    style={{ flex: 1 }}
                                />
                            )}
                        </GroupComponent>

                        <div
                            style={{
                                fontSize: 12,
                                fontWeight: 700,
                                position: "absolute",
                                left: 40,
                                bottom: 30,
                            }}
                        >
                            To become an expert{" "}
                            <Link to="/onboarding">click here</Link>.
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    common: state.common,
    calendar: state.calendar,
    contacts: state.contacts,
});

const mapDispatchToProps = (dispatch) => ({
    uiEvent: (payload) => {
        dispatch(uiEvent(payload));
    },
});

export const SigninScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(Signin);
