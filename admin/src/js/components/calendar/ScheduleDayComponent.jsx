import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ScheduleHourComponent } from "./ScheduleHourComponent";
import { ScheduleEventComponent } from "./ScheduleEventComponent";
import { timeToDecimal } from "../../helpers";

class ScheduleDay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ticker: 0,
        };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                ticker: this.state.ticker + 1,
            });
        }, 60000);
    }

    calculateTodayMarkerPosition() {
        const daybreak = timeToDecimal(this.props.calendar.daybreak);
        const start = timeToDecimal(moment().format("HH:mm")) - daybreak;
        const intervalsPerHour = 60 / this.props.calendar.interval;
        const hoursPerDay = 24 - daybreak;
        const intervals = hoursPerDay * intervalsPerHour;
        const topPercentage = (start / hoursPerDay) * 100;
        const height = this.props.calendar.height * intervals;
        const top = (topPercentage / 100) * height;

        return top;
    }

    render() {
        if (!this.props.day) return null;

        const isToday = moment().isSame(moment(this.props.day.day), "day");
        const isTodayValid =
            this.props.calendar.days.indexOf(
                moment(this.props.day.day).format("dddd").toUpperCase()
            ) != -1
                ? true
                : false;
        const top = isToday ? this.calculateTodayMarkerPosition() : 0;

        return (
            <div style={{ flex: 1, position: "relative", ...this.props.style }}>
                {isToday && !this.props.labels && (
                    <div
                        style={{
                            zIndex: 50,
                            overflow: "hidden",
                            width: "100%",
                            height: 2,
                            backgroundColor: "red",
                            position: "absolute",
                            top,
                            left: 0,
                        }}
                    />
                )}

                {this.props.day.hours.map((hour, index) => {
                    return (
                        <ScheduleHourComponent
                            key={index}
                            hour={hour}
                            day={moment(this.props.day.day).format(
                                "YYYY-MM-DD"
                            )}
                            labels={this.props.labels}
                            isTodayValid={isTodayValid}
                        />
                    );
                })}

                {!this.props.labels && (
                    <React.Fragment>
                        {this.props.events.map((event, index) => {
                            const isToday = moment(
                                event.start,
                                "YYYY-MM-DD HH:mm"
                            ).isSame(moment(this.props.day.day), "day");
                            const confirmed = event.attendees.every(
                                (attendee) => {
                                    return attendee.status == "CONFIRMED";
                                }
                            );

                            const attendee = event.attendees.filter(
                                (attendee) => {
                                    return (
                                        attendee.user._id !=
                                        this.props.account._id
                                    );
                                }
                            )[0].user;

                            if (isToday) {
                                return (
                                    <ScheduleEventComponent
                                        key={index}
                                        processed={event.processed}
                                        confirmed={confirmed}
                                        start={event.start}
                                        end={event.end}
                                        _id={event._id}
                                        name={attendee.name}
                                        color={attendee.color}
                                        notes={event.notes}
                                    />
                                );
                            }
                        })}
                    </React.Fragment>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
    account: state.account,
});

const mapDispatchToProps = (dispatch) => ({});

export const ScheduleDayComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduleDay);
