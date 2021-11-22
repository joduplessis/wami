import React from "react";
import { connect } from "react-redux";
import moment from "moment";

class Weekday extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "white",
                    borderBottom: "1px solid #EDEFF1",
                    borderTop: "1px solid #EDEFF1",
                    borderLeft: "1px solid #EDEFF1",
                    position: "relative",
                    ...this.props.style,
                }}
            >
                {this.props.day && (
                    <span
                        style={{
                            color: "#464B4E",
                            fontWeight: 700,
                            fontSize: 12,
                        }}
                    >
                        {moment(this.props.day, "YYYY-MM-DD")
                            .format("MMM DD ddd")
                            .toUpperCase()}
                    </span>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export const WeekdayComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Weekday);
