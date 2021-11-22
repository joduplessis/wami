import React from "react";
import { connect } from "react-redux";
import {
    FiCheck,
    FiCreditCard,
    FiUserCheck,
    FiAlertCircle,
    FiCheckCircle,
} from "react-icons/fi";
import { uiEvent, event } from "../../actions";
import * as axios from "axios";
import {
    timeToDecimal,
    API_PATH,
    getCookie,
    DAY,
    WEEK,
    MONTH,
    GQL,
} from "../../helpers";

const moment = require("moment-timezone");

class ScheduleEvent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };

        this.hydrate = this.hydrate.bind(this);
    }

    hydrate(id) {
        const token = getCookie("jwt");

        this.setState({
            loading: true,
        });

        GQL.fetchEvent(id, token)
            .then((response) => {
                this.props.event(response.data.data.event);

                console.log(response.data.data.event);

                this.setState({
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error);

                this.setState({
                    loading: false,
                });

                alert("An error has occurred");
            });
    }

    render() {
        if (!this.props.account.timezone) return null;

        const browserTimezoneOffset = moment(
            this.props.start,
            "YYYY-MM-DD HH:mm"
        ).utcOffset();
        const startNoTimezoneOffset = moment(
            this.props.start,
            "YYYY-MM-DD HH:mm"
        )
            .add(browserTimezoneOffset, "minutes")
            .toISOString();
        const endNoTimezoneOffset = moment(this.props.end, "YYYY-MM-DD HH:mm")
            .add(browserTimezoneOffset, "minutes")
            .toISOString();

        const startTimeWithTimezone = moment(startNoTimezoneOffset).tz(
            this.props.calendar.timezone
        );
        const endTimeWithTimezone = moment(endNoTimezoneOffset).tz(
            this.props.calendar.timezone
        );

        const daybreak = timeToDecimal(this.props.calendar.daybreak);
        const startTime = timeToDecimal(startTimeWithTimezone.format("HH:mm"));
        const start = startTime - daybreak;
        const duration = moment
            .duration(endTimeWithTimezone.diff(startTimeWithTimezone))
            .asHours();
        const intervalsPerHour = 60 / this.props.calendar.interval;
        const hoursPerDay = 24 - daybreak;
        const intervals = hoursPerDay * intervalsPerHour;
        const topPercentage = (start / hoursPerDay) * 100;
        const height = duration * intervalsPerHour * this.props.calendar.height;
        const containerHeight = this.props.calendar.height * intervals;
        const top = (topPercentage / 100) * containerHeight;
        const backgroundColor = this.props.color ? this.props.color : "20A0FF";

        return (
            <div
                className="event"
                style={{ backgroundColor, top, height }}
                onClick={() =>
                    this.props.processed
                        ? alert("This appointment has been processed")
                        : this.hydrate(this.props._id)
                }
            >
                <div className="top">
                    <span className="name">{this.props.name}</span>
                    {this.props.processed && (
                        <FiCheckCircle size={13} color="white" />
                    )}
                    {!this.props.confirmed && (
                        <FiAlertCircle size={13} color="white" />
                    )}
                    {this.props.confirmed && (
                        <FiCreditCard size={13} color="white" />
                    )}
                </div>

                <div className="title">{this.props.notes}</div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
    account: state.account,
});

const mapDispatchToProps = (dispatch) => ({
    event: (payload) => {
        dispatch(event(payload));
        dispatch(uiEvent(true));
    },
});

export const ScheduleEventComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduleEvent);
