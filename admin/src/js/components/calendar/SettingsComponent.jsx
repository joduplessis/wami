import React from "react";
import { connect } from "react-redux";
import { Input, Select, Slider, TimePicker, Tooltip, Tag, Spin } from "antd";
import {
    SlideComponent,
    ButtonComponent,
    TextButtonComponent,
} from "../../components";
import { uiCalendar, updateCalendar } from "../../actions";
import GoogleMapReact from "google-map-react";
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

const moment = require("moment-timezone");
const Option = Select.Option;
const CheckableTag = Tag.CheckableTag;
const weekdayTags = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            _id: "",
            loading: null,
            error: null,
            success: null,
            center: [60.938043, 30.337157],
            zoom: 15,
            draggable: true,
            lat: 60.955413,
            lng: 30.337844,
            rate: 890,
            start: null,
            end: null,
            daybreak: null,
            interval: null,
            days: [],
            timezone: null,
            address: null,
            location: null,
        };

        this.onCircleInteraction = this.onCircleInteraction.bind(this);
        this.onCircleInteraction3 = this.onCircleInteraction3.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleTagChange = this.handleTagChange.bind(this);
        this.formatter = this.formatter.bind(this);
        this.save = this.save.bind(this);
    }

    save() {
        this.setState({
            loading: true,
            success: null,
            error: null,
        });

        const token = getCookie("jwt");
        const {
            _id,
            start,
            end,
            interval,
            daybreak,
            days,
            timezone,
            address,
            rate,
            location,
        } = this.state;

        axios({
            url: `${API_PATH}/calendar/${_id}`,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify({
                start,
                end,
                daybreak,
                interval,
                days,
                timezone,
                address,
                location,
                rate,
            }),
        })
            .then((data) => {
                this.setState({
                    loading: false,
                    success: "Successfully updated calendar",
                });

                this.props.updateCalendar({
                    start,
                    end,
                    daybreak,
                    interval,
                    days,
                    timezone,
                    address,
                    location,
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
        if (nextProps.calendar != prevProps.calendar) {
            // Core calendar settings
            this.setState({
                _id: nextProps.calendar._id,
                start: nextProps.calendar.start,
                end: nextProps.calendar.end,
                interval: nextProps.calendar.interval,
                daybreak: nextProps.calendar.daybreak,
                rate: nextProps.calendar.rate,
                days: nextProps.calendar.days,
                timezone: nextProps.calendar.timezone,
                address: nextProps.calendar.address,
                location: nextProps.calendar.location,
            });

            // If the location is fine
            if (nextProps.calendar.location) {
                if (nextProps.calendar.location.coordinates) {
                    this.setState({
                        center: [
                            nextProps.calendar.location.coordinates[1],
                            nextProps.calendar.location.coordinates[0],
                        ],
                        lng: nextProps.calendar.location.coordinates[0],
                        lat: nextProps.calendar.location.coordinates[1],
                    });
                }
            }
        }
    }

    handleTagChange(tag, checked) {
        const { days } = this.state;
        const nextdays = checked
            ? [...days, tag]
            : days.filter((t) => t !== tag);

        this.setState({
            days: nextdays,
        });
    }

    componentDidCatch(error, info) {
        console.log(error);
    }

    onCircleInteraction(childKey, childProps, mouse) {
        this.setState({
            draggable: false,
            lat: mouse.lat,
            lng: mouse.lng,
        });
    }

    onCircleInteraction3(childKey, childProps, mouse) {
        this.setState({
            draggable: true,
        });

        this.calculateAddress();
    }

    calculateAddress() {
        const { lng, lat } = this.state;
        const key = "AIzaSyAHI1WlKwZ5exlrvSN_XjWaZgn2k4HV0qQ";
        const url = `https://maps.google.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}&sensor=false`;

        axios
            .get(url)
            .then(({ data }) => {
                const { results } = data;

                if (status != "ZERO RESULTS") {
                    const { formatted_address } = results[0];

                    this.setState({
                        address: formatted_address,
                        location: {
                            type: "Point",
                            coordinates: [lng, lat],
                        },
                    });
                } else {
                    alert(
                        "Sorry",
                        "We couldn't find this address for you, please enter it manually."
                    );
                }
            })
            .catch((error) => {
                alert(
                    "Sorry",
                    "We couldn't find this address for you, please enter it manually."
                );
            });
    }

    onChange({ center, zoom }) {
        this.setState({
            center: center,
            zoom: zoom,
        });
    }

    formatter(value) {
        return `$${value}`;
    }

    render() {
        const Marker = ({ text }) => <div className="marker">{text}</div>;

        return (
            <SlideComponent
                width={600}
                position="right"
                visible={this.props.common.calendar}
                closeCallback={() => this.props.uiCalendar(false)}
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
                    <div
                        style={{
                            width: 600,
                            height: "100%",
                            backgroundColor: "white",
                        }}
                    >
                        <div style={{ padding: 40 }}>
                            <HeadingComponent
                                title="Schedule Settings"
                                align="left"
                            />

                            {this.state.error && (
                                <p className="warning">{this.state.error}</p>
                            )}

                            {this.state.success && (
                                <p className="success">{this.state.success}</p>
                            )}

                            <SectionHeadingComponent
                                title="Default Session Rate"
                                subtitle={`Your current rate is ${this.state.rate} ZAR per session`}
                                align="left"
                            />

                            <Slider
                                defaultValue={30}
                                disabled={false}
                                placeholder="rate"
                                tipFormatter={this.formatter}
                                onChange={(rate) => this.setState({ rate })}
                                value={this.state.rate}
                            />

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
                                        value={moment(
                                            this.state.start,
                                            "HH:mm"
                                        )}
                                        size="large"
                                        placeholder="Start"
                                        minuteStep={parseInt(
                                            this.state.interval
                                        )}
                                        format="HH:mm"
                                        onChange={(start) =>
                                            this.setState({
                                                start: start.format("HH:mm"),
                                            })
                                        }
                                    />
                                </div>
                                <div style={{ marginRight: 5 }}>
                                    <SectionHeadingComponent
                                        title="End time"
                                        align="left"
                                    />
                                    <TimePicker
                                        value={moment(this.state.end, "HH:mm")}
                                        size="large"
                                        placeholder="End"
                                        minuteStep={parseInt(
                                            this.state.interval
                                        )}
                                        format="HH:mm"
                                        onChange={(end) =>
                                            this.setState({
                                                end: end.format("HH:mm"),
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <SectionHeadingComponent
                                        title="Daybreak time"
                                        align="left"
                                    />
                                    <TimePicker
                                        value={moment(
                                            this.state.daybreak,
                                            "HH:mm"
                                        )}
                                        size="large"
                                        placeholder="Daybreak"
                                        minuteStep={60}
                                        format="HH:mm"
                                        onChange={(daybreak) =>
                                            this.setState({
                                                daybreak: daybreak.format(
                                                    "HH:mm"
                                                ),
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <SectionHeadingComponent
                                title="Session Duration"
                                align="left"
                            />

                            <Select
                                defaultValue={this.state.interval}
                                onChange={(value) =>
                                    this.setState({ interval: value })
                                }
                            >
                                <Option value={30}>30 minutes</Option>
                                <Option value={15}>15 minutes</Option>
                            </Select>

                            <SectionHeadingComponent
                                title="Timezone"
                                align="left"
                            />

                            <Select
                                defaultValue={this.state.timezone}
                                onChange={(value) =>
                                    this.setState({ timezone: value })
                                }
                            >
                                <Option value="default">
                                    Select a timezone
                                </Option>
                                {moment.tz.names().map((timezone, index) => {
                                    return (
                                        <Option value={timezone} key={index}>
                                            {timezone}
                                        </Option>
                                    );
                                })}
                            </Select>

                            <SectionHeadingComponent
                                title="Active days"
                                align="left"
                            />

                            {weekdayTags.map((tag) => (
                                <CheckableTag
                                    key={tag}
                                    checked={this.state.days.indexOf(tag) > -1}
                                    onChange={(checked) =>
                                        this.handleTagChange(tag, checked)
                                    }
                                >
                                    {tag}
                                </CheckableTag>
                            ))}

                            <SectionHeadingComponent
                                title="Address"
                                align="left"
                            />

                            <Input
                                size="large"
                                placeholder="Address"
                                value={this.state.address}
                                onChange={({ target }) =>
                                    this.setState({ address: target.value })
                                }
                            />

                            <SectionHeadingComponent
                                title="Location"
                                align="left"
                            />

                            <TextButtonComponent
                                action={() => this.props.uiCalendar(false)}
                                style={{
                                    position: "absolute",
                                    top: 20,
                                    right: 20,
                                }}
                            >
                                <FiX size={30} color="#9facbd" />
                            </TextButtonComponent>

                            <div
                                style={{
                                    height: 500,
                                    width: "100%",
                                    borderRadius: 5,
                                    overflow: "hidden",
                                }}
                            >
                                <GoogleMapReact
                                    bootstrapURLKeys={{
                                        key:
                                            "AIzaSyClqwvd8eICk3eXxGbBdOi7J0ZKrWs2bJU",
                                    }}
                                    center={this.state.center}
                                    zoom={this.state.zoom}
                                    draggable={this.state.draggable}
                                    onChange={this.onChange}
                                    onChildMouseDown={this.onCircleInteraction}
                                    onChildMouseUp={this.onCircleInteraction3}
                                    onChildMouseMove={this.onCircleInteraction}
                                    onChildClick={() =>
                                        console.log("child click")
                                    }
                                    onClick={() => console.log("mapClick")}
                                >
                                    <Marker
                                        lat={this.state.lat}
                                        lng={this.state.lng}
                                    />
                                </GoogleMapReact>
                            </div>

                            {this.state.loading && (
                                <GroupComponent
                                    style={{ width: "100%", marginTop: 50 }}
                                >
                                    <Spin size="large" />
                                </GroupComponent>
                            )}

                            {!this.state.loading && (
                                <React.Fragment>
                                    <ButtonComponent
                                        action={this.save}
                                        text="Okay"
                                        style={{ width: "100%", marginTop: 50 }}
                                    />
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </div>
            </SlideComponent>
        );
    }
}

const mapStateToProps = (state) => ({
    common: state.common,
    calendar: state.calendar,
});

const mapDispatchToProps = (dispatch) => ({
    uiCalendar: (payload) => {
        dispatch(uiCalendar(payload));
    },

    updateCalendar: (payload) => {
        dispatch(updateCalendar(payload));
    },
});

export const SettingsComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Settings);
