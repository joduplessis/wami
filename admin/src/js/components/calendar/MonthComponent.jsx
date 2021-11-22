import React from "react";
import { connect } from "react-redux";
import moment, { weekdays } from "moment";
import { MonthDayComponent, WeekdaysComponent } from "./";
import {
    timeToDecimal,
    API_PATH,
    getCookie,
    DAY,
    WEEK,
    MONTH,
} from "../../helpers";

class Month extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.calendar.view != MONTH) return null;

        const weeks = [];
        const weekdays = [];
        const startWeek = moment(
            this.props.calendar.date,
            "YYYY-MM-DD"
        ).startOf("month");
        const endWeek = moment(this.props.calendar.date, "YYYY-MM-DD")
            .endOf("month")
            .add(1, "weeks");
        let weekdaysAdded = false;

        for (
            let week = startWeek;
            week.isBefore(endWeek);
            week.add(1, "week")
        ) {
            const days = [];
            const startDay = moment(week).startOf("week");
            const endDay = moment(week).endOf("week");

            for (let day = startDay; day.isBefore(endDay); day.add(1, "days")) {
                days.push(day.format("YYYY-MM-DD HH:mm"));

                if (!weekdaysAdded) {
                    weekdays.push({
                        day: day.format("YYYY-MM-DD HH:mm"),
                        hours: [],
                    });
                }
            }

            weeks.push(days);

            weekdaysAdded = true;
        }

        return (
            <React.Fragment>
                <WeekdaysComponent days={weekdays} nospacer />

                {weeks.map((week, index) => {
                    return (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                flex: 1,
                            }}
                            key={index}
                        >
                            {week.map((day, index) => {
                                return (
                                    <MonthDayComponent day={day} key={index} />
                                );
                            })}
                        </div>
                    );
                })}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export const MonthComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Month);
