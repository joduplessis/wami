import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { WeekdaysComponent } from "./WeekdaysComponent";
import { ScheduleDayComponent } from "./ScheduleDayComponent";
import {
    timeToDecimal,
    API_PATH,
    getCookie,
    DAY,
    WEEK,
    MONTH,
} from "../../helpers";

class Week extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.calendar.view != WEEK) return null;

        const days = [];
        const startDay = moment(this.props.calendar.date, "YYYY-MM-DD").startOf(
            "week"
        );
        const endDay = moment(this.props.calendar.date, "YYYY-MM-DD").endOf(
            "week"
        );
        const daybreak = timeToDecimal(this.props.calendar.daybreak);

        for (let day = startDay; day.isBefore(endDay); day.add(1, "days")) {
            const hours = [];
            const startHour = moment(day).hour(daybreak);
            const endHour = moment(day).endOf("day");

            for (
                let hour = startHour;
                hour.isBefore(endHour);
                hour.add(1, "hours")
            ) {
                hours.push(hour.format("YYYY-MM-DD HH:mm"));
            }

            days.push({
                day: day.format("YYYY-MM-DD HH:mm"),
                hours,
            });
        }

        return (
            <React.Fragment>
                <WeekdaysComponent
                    days={days}
                    spacerStyle={{ flex: "none", width: 50 }}
                />

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        flex: 1,
                        overflow: "scroll",
                    }}
                >
                    <ScheduleDayComponent
                        day={days[0]}
                        labels={true}
                        style={{ flex: "none", width: 50 }}
                    />

                    {days.map((day, index) => {
                        return (
                            <ScheduleDayComponent
                                key={index}
                                day={day}
                                labels={false}
                            />
                        );
                    })}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export const WeekComponent = connect(mapStateToProps, mapDispatchToProps)(Week);
