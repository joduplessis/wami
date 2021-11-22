import React from "react";
import { connect } from "react-redux";
import moment from "moment";
import { ScheduleDayComponent, WeekdaysComponent } from "./";
import { Tooltip } from "antd";
import { uiEvent, event } from "../../actions";
import { AvatarComponent } from "../";
import { GQL } from "../../helpers";

class MonthDay extends React.Component {
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
        const isToday = moment(this.props.day, "YYYY-MM-DD HH:mm").isSame(
            moment(),
            "day"
        );
        const isMonth = moment(this.props.day, "YYYY-MM-DD HH:mm").isSame(
            moment(),
            "month"
        );
        const color = isMonth ? (isToday ? "#718093" : "#D3DCE6") : "#eef2f5";
        const day = moment(this.props.day, "YYYY-MM-DD HH:mm").format("DD");
        const isTodayValid =
            this.props.calendar.days.indexOf(
                moment(this.props.day).format("dddd").toUpperCase()
            ) != -1
                ? true
                : false;
        const backgroundColor = isTodayValid ? "white" : "#F9FAFC";
        const fontWeight = isToday ? 800 : 500;

        return (
            <div
                style={{
                    flex: 1,
                    backgroundColor,
                    borderTop: "1px solid #eef2f5",
                    borderLeft: "1px solid #eef2f5",
                    position: "relative",
                    display: "flex",
                    flexDirection: "row",
                    alignContent: "flex-end",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color,
                        fontSize: 12,
                        fontWeight,
                    }}
                >
                    {day}
                </span>

                {this.props.events.map((event, index) => {
                    const isEventToday = moment(
                        event.start,
                        "YYYY-MM-DD HH:mm"
                    ).isSame(moment(this.props.day, "YYYY-MM-DD HH:mm"), "day");

                    if (isEventToday) {
                        return (
                            <Tooltip title={event.name} key={index}>
                                <span
                                    onClick={() => this.hydrate(event._id)}
                                    style={{
                                        cursor: "pointer",
                                        marginBottom: 5,
                                        marginRight: 5,
                                    }}
                                >
                                    <AvatarComponent
                                        width={20}
                                        height={20}
                                        borderWidth={1}
                                        borderColor={event.color}
                                        background="white"
                                    />
                                </span>
                            </Tooltip>
                        );
                    }
                })}
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

export const MonthDayComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(MonthDay);
