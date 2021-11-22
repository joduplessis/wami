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
import { uiEvent, updateEvents } from "../../actions";
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

class Event extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            error: null,
            success: null,
            _id: "",
            start: "",
            end: "",
            notes: "",
            rate: 0,
            offline: false,
            attendees: [],
        };

        this.formatter = this.formatter.bind(this);
        this.save = this.save.bind(this);
        this.call = this.call.bind(this);
    }

    call() {}

    save() {
        this.setState({
            loading: true,
            success: null,
            error: null,
        });

        const token = getCookie("jwt");
        const offline = this.state.offline ? this.state.offline : false;
        const { _id, start, end, notes, rate } = this.state;

        axios({
            url: `${API_PATH}/event/${_id}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify({
                start: start.format(),
                end: end.format(),
                offline,
                notes,
                rate,
            }),
        })
            .then((response) => {
                this.setState({
                    loading: false,
                    success: "Successfully updated event",
                });

                this.props.updateEvents({
                    _id,
                    start: response.data.event.start,
                    end: response.data.event.end,
                    offline,
                    notes,
                    rate,
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error: "You are not logged in.",
                });
            });
    }

    componentWillReceiveProps(nextProps, prevProps) {
        if (nextProps.event != prevProps.event) {
            this.setState({
                _id: nextProps.event._id,
                start: moment(nextProps.event.start).tz(
                    this.props.calendar.timezone
                ),
                end: moment(nextProps.event.end).tz(
                    this.props.calendar.timezone
                ),
                notes: nextProps.event.notes,
                interval: this.props.calendar.interval,
                rate: nextProps.event.rate,
                offline: nextProps.event.offline
                    ? nextProps.event.offline
                    : false,
                attendees: nextProps.event.attendees
                    ? nextProps.event.attendees.filter((attendee) => {
                          return attendee.user._id != this.props.account._id;
                      })
                    : [],
            });
        }
    }

    formatter(value) {
        return `$${value}`;
    }

    render() {
        return (
            <PopupComponent
                width="100%"
                height="100%"
                visible={this.props.common.event}
                closeCallback={() => this.props.uiEvent(false)}
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
                                title="Appointment"
                                subtitle={
                                    this.state.attendees.length == 1
                                        ? this.state.attendees[0].user.name
                                        : null
                                }
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
                                <div style={{ marginRight: 5 }}>
                                    <SectionHeadingComponent
                                        title="Start time"
                                        align="left"
                                    />
                                    <TimePicker
                                        value={this.state.start}
                                        size="large"
                                        placeholder="Start"
                                        minuteStep={parseInt(
                                            this.state.interval
                                        )}
                                        format="HH:mm"
                                        onChange={(start) =>
                                            this.setState({ start: start })
                                        }
                                    />
                                </div>
                                <div style={{ marginRight: 20 }}>
                                    <SectionHeadingComponent
                                        title="End time"
                                        align="left"
                                    />
                                    <TimePicker
                                        value={this.state.end}
                                        size="large"
                                        placeholder="End"
                                        minuteStep={parseInt(
                                            this.state.interval
                                        )}
                                        format="HH:mm"
                                        onChange={(end) =>
                                            this.setState({ end: end })
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
                                {/*
                                <div style={{paddingLeft: 20}}>
                                    <SectionHeadingComponent title="Tools" align="left"/>
                                    <ButtonComponent
                                        text="Make video call to client"
                                        action={this.call}
                                    />
                                </div>
                                */}
                            </div>

                            <SectionHeadingComponent
                                title="Notes"
                                align="left"
                            />

                            <Input.TextArea
                                size="large"
                                placeholder="Notes"
                                value={this.state.notes}
                                onChange={({ target }) =>
                                    this.setState({ notes: target.value })
                                }
                            />

                            <SectionHeadingComponent
                                title="Session Rate"
                                subtitle={`Rate for this session is $${this.state.rate}`}
                                align="left"
                            />

                            <Slider
                                defaultValue={30}
                                disabled={false}
                                placeholder="rate"
                                tipFormatter={this.formatter}
                                value={this.state.rate}
                                onChange={(rate) => this.setState({ rate })}
                            />

                            {this.state.loading && (
                                <GroupComponent
                                    style={{ width: "100%", marginTop: 50 }}
                                >
                                    <Spin size="large" />
                                </GroupComponent>
                            )}

                            {!this.state.loading && (
                                <ButtonComponent
                                    text="Save"
                                    style={{ width: "100%", marginTop: 50 }}
                                    action={this.save}
                                />
                            )}

                            <TextButtonComponent
                                action={() => this.props.uiEvent(false)}
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
    uiEvent: (payload) => {
        dispatch(uiEvent(payload));
    },

    updateEvents: (payload) => {
        dispatch(updateEvents(payload));
    },
});

export const EventComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Event);
