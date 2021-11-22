import React from "react";
import { connect } from "react-redux";
import { Input, Select, Spin } from "antd";
import * as axios from "axios";
import {
    HeadingComponent,
    SectionHeadingComponent,
    SlideComponent,
    ButtonComponent,
    TextButtonComponent,
    GroupComponent,
} from "./";
import { FiX } from "react-icons/fi";
import { uiAccount, updateAccount } from "../actions";
import Auth from "@aws-amplify/auth";
import { API_PATH, getCookie, deleteCookie } from "../helpers";

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            success: null,
            loading: false,
            token: null,
            name: "",
            title: "",
            description: "",
        };

        this.signout = this.signout.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.account != prevProps.account) {
            this.setState({
                _id: nextProps.account._id,
                name: nextProps.account.name,
                title: nextProps.account.title,
                description: nextProps.account.description,
            });
        }
    }

    save() {
        this.setState({
            loading: true,
            success: null,
            error: null,
        });

        const token = getCookie("jwt");
        const { name, description, title } = this.state;

        axios({
            url: `${API_PATH}/user/${this.props.account._id}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify({
                name,
                description,
                title,
            }),
        })
            .then((data) => {
                this.setState({
                    loading: false,
                    success: "Successfully updated account",
                });

                this.props.updateAccount({
                    name,
                    description,
                    title,
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error: "You are not logged in.",
                });
            });
    }

    signout() {
        deleteCookie("jwt");
        this.props.history.push("/");
    }

    render() {
        return (
            <SlideComponent
                width={600}
                position="right"
                visible={this.props.common.account}
                closeCallback={() => this.props.uiAccount(false)}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 600,
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    {this.state.title && (
                        <div
                            style={{
                                width: 600,
                                height: "100%",
                                backgroundColor: "white",
                            }}
                        >
                            <div style={{ padding: 40 }}>
                                <HeadingComponent
                                    title="Account"
                                    align="left"
                                />

                                {this.state.error && (
                                    <p className="warning">
                                        {this.state.error}
                                    </p>
                                )}

                                {this.state.success && (
                                    <p className="success">
                                        {this.state.success}
                                    </p>
                                )}

                                <SectionHeadingComponent
                                    title="Name"
                                    align="left"
                                />

                                <Input
                                    size="large"
                                    value={this.state.name}
                                    placeholder="Full name"
                                    onChange={({ target }) =>
                                        this.setState({ name: target.value })
                                    }
                                />

                                <SectionHeadingComponent
                                    title="Title"
                                    align="left"
                                />

                                <GroupComponent>
                                    <Input
                                        size="large"
                                        placeholder="Title"
                                        value={this.state.title}
                                        onChange={({ target }) =>
                                            this.setState({
                                                title: target.value,
                                            })
                                        }
                                        style={{ marginRight: 5 }}
                                    />
                                </GroupComponent>

                                <SectionHeadingComponent
                                    title="Bio"
                                    subtitle="Your bio is what users will see when searching for experts."
                                    align="left"
                                />

                                <Input.TextArea
                                    size="large"
                                    value={this.state.description}
                                    placeholder="Bio"
                                    onChange={({ target }) =>
                                        this.setState({
                                            description: target.value,
                                        })
                                    }
                                />

                                <div style={{ marginTop: 50 }}>
                                    {this.state.loading && (
                                        <GroupComponent>
                                            <Spin size="large" />
                                        </GroupComponent>
                                    )}

                                    {!this.state.loading && (
                                        <React.Fragment>
                                            <ButtonComponent
                                                text="Save"
                                                action={this.save}
                                                style={{ width: "100%" }}
                                            />

                                            <ButtonComponent
                                                action={this.signout}
                                                text="Logout"
                                                style={{
                                                    width: "100%",
                                                    marginTop: 10,
                                                }}
                                            />
                                        </React.Fragment>
                                    )}
                                </div>

                                <TextButtonComponent
                                    action={() => this.props.uiAccount(false)}
                                    style={{
                                        position: "absolute",
                                        top: 20,
                                        right: 20,
                                    }}
                                >
                                    <FiX size={30} color="#9facbd" />
                                </TextButtonComponent>
                            </div>
                        </div>
                    )}
                </div>
            </SlideComponent>
        );
    }
}

const mapStateToProps = (state) => ({
    common: state.common,
    tags: state.tags,
    account: state.account,
});

const mapDispatchToProps = (dispatch) => ({
    uiAccount: (payload) => {
        dispatch(uiAccount(payload));
    },

    updateAccount: (payload) => {
        dispatch(updateAccount(payload));
    },
});

export const AccountComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Account);
