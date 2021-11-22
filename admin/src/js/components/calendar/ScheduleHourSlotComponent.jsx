import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { FiPlusCircle } from "react-icons/fi";
import { NewEventComponent } from "./";
import { uiNewEvent } from "../../actions";

class ScheduleHourSlot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            over: false,
        };
    }

    render() {
        const background = this.props.active ? "white" : "#F9FAFC";
        const time = moment(this.props.slot, "HH:mm").format("HH:mm");
        const show = time.slice(-2) == "00" ? true : false;

        return (
            <div
                style={{
                    borderLeft: "1px solid #EEF1F7",
                    position: "relative",
                    width: "100%",
                    height: this.props.calendar.height,
                    textAlign: "right",
                    background,
                    backgroundSize: `${this.props.calendar.height}px ${this.props.calendar.height}px`,
                }}
                onMouseEnter={(e) => this.setState({ over: true })}
                onMouseLeave={(e) => this.setState({ over: false })}
            >
                {this.state.over && (
                    <div
                        onClick={() =>
                            this.props.uiNewEvent(
                                this.props.day +
                                    " " +
                                    this.props.time.format("HH:mm")
                            )
                        }
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            alignContent: "center",
                            justifyContent: "center",
                            zIndex: 10,
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            borderRadius: 5,
                            height: this.props.calendar.height,
                            backgroundColor: "#D3DCE6",
                            cursor: "pointer",
                        }}
                    >
                        <FiPlusCircle size={12} color="#99A9BF" />
                    </div>
                )}

                <div
                    style={{
                        flex: 1,
                        borderTop: `${this.props.borderWidth}px solid #EEF1F7`,
                    }}
                >
                    {this.props.labels && show && (
                        <span
                            style={{
                                paddingRight: 5,
                                paddingTop: 0,
                                fontSize: 10,
                                fontWeight: 700,
                                color: "#424E5E",
                            }}
                        >
                            {moment(this.props.slot, "HH:mm").format("HH:mm")}
                        </span>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
});

const mapDispatchToProps = (dispatch) => ({
    uiNewEvent: (payload) => {
        dispatch(uiNewEvent(payload));
    },
});

export const ScheduleHourSlotComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(ScheduleHourSlot);
