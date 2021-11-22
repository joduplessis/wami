import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { WeekdayComponent } from "./WeekdayComponent";

class Weekdays extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ display: "flex", flexDirection: "row", height: 30 }}>
                {!this.props.nospacer && (
                    <WeekdayComponent
                        style={{ flex: 0.5, ...this.props.spacerStyle }}
                    />
                )}

                {this.props.days.map((day, index) => {
                    return <WeekdayComponent key={index} day={day.day} />;
                })}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export const WeekdaysComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Weekdays);
