import React from "react";
import { connect } from "react-redux";
import {
    Input,
    Select,
    Slider,
    TimePicker,
    Tooltip,
    Switch,
    Tag,
    Mention,
    Avatar,
    Spin,
} from "antd";
import {
    PopupComponent,
    ButtonComponent,
    TextButtonComponent,
} from "../../components";
import { uiNewEvent, updateEvents, addEvents } from "../../actions";
import moment from "moment";
import { HeadingComponent, SectionHeadingComponent, GroupComponent } from "../";
import { FiX } from "react-icons/fi";
import * as axios from "axios";
import {
    timeToDecimal,
    API_PATH,
    getCookie,
    DAY,
    WEEK,
    MONTH,
} from "../../helpers";

const Option = Select.Option;

class NewEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            error: null,
            success: null,
            offline: false,
            start: moment(),
            client: "Select client",
        };

        this.formatter = this.formatter.bind(this);
        this.save = this.save.bind(this);
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.common.new_event) {
            this.setState({
                start: moment.tz(
                    nextProps.common.new_event,
                    this.props.calendar.timezone
                ),
            });
        } else {
            this.setState({
                start: moment(),
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
        const user_id = this.state.client;
        const expert_id = this.props.account._id;
        const start_time = this.state.start.format();
        const is_offline = this.state.offline ? this.state.offline : false;
        const from_expert = true;

        axios({
            url: `${API_PATH}/event`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify({
                user_id,
                expert_id,
                start_time,
                is_offline,
                from_expert,
            }),
        })
            .then((response) => {
                this.props.addEvents(response.data);
                this.setState({
                    loading: false,
                    success: "Successfully added event",
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error: "You are not logged in.",
                });
            });
    }

    formatter(value) {
        return `$${value}`;
    }

    render() {
        return (
            <PopupComponent
                width="100%"
                height="100%"
                visible={this.props.common.new_event}
                closeCallback={() => this.props.uiNewEvent(false)}
            >
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <div
                        style={{
                            marginRight: "auto",
                            marginLeft: "auto",
                            width: "70%",
                            height: "100%",
                            overflow: "scroll",
                        }}
                    >
                        <div style={{ padding: 40 }}>
                            <HeadingComponent
                                title="New Appointment"
                                subtitle="Create a new appointment with a client"
                                align="left"
                            />

                            {this.state.error && (
                                <p className="warning">{this.state.error}</p>
                            )}

                            {this.state.success && (
                                <p className="success">{this.state.success}</p>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                }}
                            >
                                <div style={{ marginRight: 25 }}>
                                    <SectionHeadingComponent
                                        title="Client"
                                        align="left"
                                    />
                                    <Select
                                        size="large"
                                        defaultValue={this.state.client}
                                        onChange={(value) =>
                                            this.setState({ client: value })
                                        }
                                    >
                                        {this.props.contacts.map(
                                            (contact, index) => {
                                                // Remember:  we are always the contact!
                                                if (
                                                    contact.user._id ==
                                                    this.props.account._id
                                                )
                                                    return null;

                                                // The client will always be the user because they make the first request
                                                return (
                                                    <Option
                                                        value={contact.user._id}
                                                        key={index}
                                                    >
                                                        {contact.user.name}
                                                    </Option>
                                                );
                                            }
                                        )}
                                    </Select>
                                </div>
                                <div style={{ marginRight: 25 }}>
                                    <SectionHeadingComponent
                                        title="Start time"
                                        align="left"
                                    />
                                    <TimePicker
                                        value={this.state.start}
                                        size="large"
                                        placeholder="Start"
                                        minuteStep={parseInt(
                                            this.props.calendar.interval
                                        )}
                                        format="HH:mm"
                                        onChange={(start) =>
                                            this.setState({ start: start })
                                        }
                                    />
                                </div>

                                <div>
                                    <SectionHeadingComponent
                                        title="Meet at premises"
                                        subtitle="Enabled will indicate meeting at your premises."
                                        align="left"
                                    />
                                    <Switch
                                        defaultChecked={
                                            this.state.offline ? true : false
                                        }
                                        onChange={(value) =>
                                            this.setState({
                                                offline: !this.state.offline,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {this.state.loading && (
                                <GroupComponent
                                    style={{ width: "100%", marginTop: 50 }}
                                >
                                    <Spin size="large" />
                                </GroupComponent>
                            )}

                            {!this.state.loading && (
                                <ButtonComponent
                                    text="Create Appointment"
                                    style={{ width: "100%", marginTop: 50 }}
                                    action={this.save}
                                />
                            )}

                            <TextButtonComponent
                                action={() => this.props.uiNewEvent(false)}
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
                </div>
            </PopupComponent>
        );
    }
}

const mapStateToProps = (state) => ({
    common: state.common,
    account: state.account,
    calendar: state.calendar,
    contacts: state.contacts,
    event: state.event,
});

const mapDispatchToProps = (dispatch) => ({
    uiNewEvent: (payload) => {
        dispatch(uiNewEvent(payload));
    },

    addEvents: (payload) => {
        dispatch(addEvents(payload));
        dispatch(uiNewEvent(false));
    },
});

export const NewEventComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(NewEvent);
