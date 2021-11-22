import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    WeekComponent,
    DayComponent,
    MonthComponent,
    SettingsComponent,
    EventComponent,
    NewEventComponent,
} from "../components/calendar";
import {
    ToolbarComponent,
    ButtonComponent,
    HeadingComponent,
    TextButtonComponent,
    AvatarComponent,
} from "../components";
import moment from "moment";
import { Input, Select, Menu, Dropdown, Icon, Tooltip } from "antd";
import {
    FiSettings,
    FiChevronLeft,
    FiChevronRight,
    FiChevronDown,
    FiLifeBuoy,
    FiCalendar,
} from "react-icons/fi";
import { updateDate, updateView, uiCalendar, uiAccount } from "../actions";
import { DAY, WEEK, MONTH } from "../helpers";

class Calendar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            popup: false,
            slide: false,
        };

        this.updateView = this.updateView.bind(this);
        this.moveViewForward = this.moveViewForward.bind(this);
        this.moveViewBack = this.moveViewBack.bind(this);
        this.moveViewToday = this.moveViewToday.bind(this);
    }

    moveViewToday() {
        this.props.updateDate(moment().format("YYYY-MM-DD"));
    }

    moveViewBack() {
        if (this.props.calendar.view == DAY) {
            this.props.updateDate(
                moment(this.props.calendar.date, "YYYY-MM-DD")
                    .subtract(1, "day")
                    .format("YYYY-MM-DD")
            );
        }

        if (this.props.calendar.view == WEEK) {
            this.props.updateDate(
                moment(this.props.calendar.date, "YYYY-MM-DD")
                    .subtract(1, "week")
                    .format("YYYY-MM-DD")
            );
        }

        if (this.props.calendar.view == MONTH) {
            this.props.updateDate(
                moment(this.props.calendar.date, "YYYY-MM-DD")
                    .subtract(1, "month")
                    .format("YYYY-MM-DD")
            );
        }
    }

    moveViewForward() {
        if (this.props.calendar.view == DAY) {
            this.props.updateDate(
                moment(this.props.calendar.date, "YYYY-MM-DD")
                    .add(1, "day")
                    .format("YYYY-MM-DD")
            );
        }

        if (this.props.calendar.view == WEEK) {
            this.props.updateDate(
                moment(this.props.calendar.date, "YYYY-MM-DD")
                    .add(1, "week")
                    .format("YYYY-MM-DD")
            );
        }

        if (this.props.calendar.view == MONTH) {
            this.props.updateDate(
                moment(this.props.calendar.date, "YYYY-MM-DD")
                    .add(1, "month")
                    .format("YYYY-MM-DD")
            );
        }
    }

    updateView(view) {
        this.props.updateView(view);
    }

    render() {
        if (!this.props.calendar.view) return null;

        const view = (
            <Menu>
                <Menu.Item key="0">
                    <a
                        href="javascript:void(0);"
                        onClick={() => this.updateView(DAY)}
                    >
                        Day View
                    </a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a
                        href="javascript:void(0);"
                        onClick={() => this.updateView(WEEK)}
                    >
                        Week View
                    </a>
                </Menu.Item>
                <Menu.Item key="2">
                    <a
                        href="javascript:void(0);"
                        onClick={() => this.updateView(MONTH)}
                    >
                        Month View
                    </a>
                </Menu.Item>
            </Menu>
        );

        return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <ToolbarComponent>
                    <HeadingComponent
                        title={moment(
                            this.props.calendar.date,
                            "YYYY-MM-DD"
                        ).format("MMMM YYYY")}
                    />

                    <div style={{ flex: 1 }}></div>

                    <Dropdown overlay={view}>
                        <a className="ant-dropdown-link group">
                            <ButtonComponent
                                style={{ marginRight: 20, marginLeft: 15 }}
                                icon={
                                    <FiChevronDown
                                        size={20}
                                        color="#25D5A1"
                                        style={{ marginRight: 5 }}
                                    />
                                }
                                text={`${this.props.calendar.view.toLowerCase()} View`}
                                selected={
                                    this.props.calendar.view == "day"
                                        ? true
                                        : false
                                }
                                action={() => console.log("")}
                            />
                        </a>
                    </Dropdown>

                    <TextButtonComponent
                        action={this.moveViewBack}
                        style={{ marginRight: 20 }}
                    >
                        <FiChevronLeft
                            size={22}
                            color="#9facbd"
                            style={{ marginRight: 5 }}
                        />
                    </TextButtonComponent>

                    <TextButtonComponent
                        action={this.moveViewForward}
                        style={{ marginRight: 20 }}
                    >
                        <FiChevronRight
                            size={22}
                            color="#9facbd"
                            style={{ marginRight: 5 }}
                        />
                    </TextButtonComponent>

                    <TextButtonComponent
                        text="Today"
                        action={this.moveViewToday}
                        style={{ marginRight: 20 }}
                    >
                        <FiCalendar
                            size={18}
                            color="#9facbd"
                            style={{ marginRight: 5 }}
                        />
                    </TextButtonComponent>

                    <div
                        style={{
                            height: 20,
                            width: 1,
                            backgroundColor: "#e8edf2",
                            marginRight: 20,
                        }}
                    />

                    <TextButtonComponent
                        text="Schedule Setup"
                        action={() => this.props.uiCalendar(true)}
                        style={{ marginRight: 20 }}
                    >
                        <FiSettings
                            size={18}
                            color="#9facbd"
                            style={{ marginRight: 5 }}
                        />
                    </TextButtonComponent>

                    <div
                        style={{
                            height: 20,
                            width: 1,
                            backgroundColor: "#e8edf2",
                            marginRight: 20,
                        }}
                    />

                    <TextButtonComponent
                        action={() =>
                            (location.href =
                                "mailto:support@wami.app?subject=Web app issue")
                        }
                        style={{ marginRight: 20 }}
                    >
                        <FiLifeBuoy size={18} color="#9facbd" />
                    </TextButtonComponent>

                    <a
                        href="javascript:void(0);"
                        onClick={() => this.props.uiAccount(true)}
                    >
                        <AvatarComponent
                            width={30}
                            height={30}
                            src={this.props.account.image}
                            borderWidth={2}
                            borderColor="#0facf3"
                        />
                    </a>
                </ToolbarComponent>

                <WeekComponent />
                <DayComponent />
                <MonthComponent />
                <EventComponent />
                <SettingsComponent />
                <NewEventComponent />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    common: state.common,
    calendar: state.calendar,
    account: state.account,
});

const mapDispatchToProps = (dispatch) => ({
    updateDate: (payload) => {
        dispatch(updateDate(payload));
    },

    updateView: (payload) => {
        dispatch(updateView(payload));
    },

    uiCalendar: (payload) => {
        dispatch(uiCalendar(payload));
    },

    uiAccount: (payload) => {
        dispatch(uiAccount(payload));
    },
});

export const CalendarPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Calendar);
