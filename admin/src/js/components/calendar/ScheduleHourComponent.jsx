import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ScheduleHourSlotComponent } from "./ScheduleHourSlotComponent";
import {
    timeToDecimal,
    API_PATH,
    getCookie,
    DAY,
    WEEK,
    MONTH,
} from "../../helpers";

class ScheduleHour extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const slots = [];
        const startMinute = moment(this.props.hour, "YYYY-MM-DD HH:mm").startOf(
            "hour"
        );
        const endMinute = moment(this.props.hour, "YYYY-MM-DD HH:mm").endOf(
            "hour"
        );

        for (
            let minute = startMinute;
            minute.isBefore(endMinute);
            minute.add(this.props.calendar.interval, "minute")
        ) {
            slots.push(minute.format("HH:mm"));
        }

        return (
            <div style={{ backgroundColor: "white", position: "relative" }}>
                <React.Fragment>
                    {slots.map((slot, index) => {
                        const time = moment(slot, "HH:mm");
                        const beforeTime = moment(
                            this.props.calendar.start,
                            "HH:mm"
                        );
                        const afterTime = moment(
                            this.props.calendar.end,
                            "HH:mm"
                        );
                        const active = this.props.labels
                            ? true
                            : time.isBetween(
                                  beforeTime,
                                  afterTime,
                                  null,
                                  "[)"
                              ) && this.props.isTodayValid;
                        const { day } = this.props;

                        return (
                            <ScheduleHourSlotComponent
                                key={index}
                                slot={slot}
                                active={active}
                                time={time}
                                day={day}
                                labels={this.props.labels}
                                borderWidth={index == 0 ? 2 : 1}
                            />
                        );
                    })}
                </React.Fragment>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export const ScheduleHourComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduleHour);
