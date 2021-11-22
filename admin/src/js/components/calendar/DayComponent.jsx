import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ScheduleDayComponent, WeekdaysComponent } from "./";
import { timeToDecimal, DAY, WEEK, MONTH } from "../../helpers";

class Day extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.calendar.view != DAY) return null;

        const days = [];
        const hours = [];
        const daybreak = timeToDecimal(this.props.calendar.daybreak);
        const startHour = moment(this.props.calendar.date).hour(daybreak);
        const endHour = moment(this.props.calendar.date).endOf("day");

        for (
            let hour = startHour;
            hour.isBefore(endHour);
            hour.add(1, "hours")
        ) {
            hours.push(hour.format("YYYY-MM-DD HH:mm"));
        }

        days.push({
            day: moment(this.props.calendar.date, "YYYY-MM-DD").format(
                "YYYY-MM-DD HH:mm"
            ),
            hours,
        });

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
                    {/* First one we use as a starting col */}
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

export const DayComponent = connect(mapStateToProps, mapDispatchToProps)(Day);
