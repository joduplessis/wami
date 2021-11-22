import React from "react";
import { Link } from "react-router-dom";
import {
    FiSettings,
    FiPlus,
    FiCreditCard,
    FiMenu,
    FiCalendar,
    FiUsers,
    FiHelpCircle,
    FiMoreVertical,
    FiUserPlus,
    FiDollarSign,
    FiPieChart,
    FiUserX,
    FiUserCheck,
    FiCircle,
    FiPlusCircle,
    FiMap,
    FiChevronDown,
    FiClock,
    FiUser,
    FiLifeBuoy,
} from "react-icons/fi";
import {
    AvatarComponent,
    PopupComponent,
    ButtonComponent,
    ContactComponent,
    AccountComponent,
} from "./";
import { Input, Select, Menu, Dropdown, Icon, Tooltip } from "antd";
import { uiAccount, uiEvent } from "../actions";
import { connect } from "react-redux";

class Nav extends React.Component {
    render() {
        return (
            <div className="nav">
                <Tooltip title="Schedule" placement="right">
                    <Link to="/app/calendar" className="link">
                        <FiClock />
                    </Link>
                </Tooltip>

                <Tooltip title="Contacts" placement="right">
                    <Link to="/app/contacts" className="link">
                        <FiUsers />
                    </Link>
                </Tooltip>

                <Tooltip title="Transactions" placement="right">
                    <Link to="/app/transactions" className="link">
                        <FiPieChart />
                    </Link>
                </Tooltip>

                <div style={{ flex: 1 }} />

                <Tooltip title="Help" placement="right">
                    <Link to="mailto:hello@wami.app" className="link">
                        <FiLifeBuoy />
                    </Link>
                </Tooltip>

                <Tooltip title="Account" placement="right">
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
                </Tooltip>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    account: state.account,
    events: state.events,
});

const mapDispatchToProps = (dispatch) => ({
    uiAccount: (payload) => {
        dispatch(uiAccount(payload));
    },

    uiEvent: (payload) => {
        dispatch(uiEvent(payload));
    },
});

export const NavComponent = connect(mapStateToProps, mapDispatchToProps)(Nav);
