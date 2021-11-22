import React from "React";
import styled, { css } from "react-emotion";
import { connect } from "react-redux";
import { channel, user, loading, error } from "../actions";

const notification = css`
    position: absolute;
    z-index: 10001;
    top: 0px;
    left: 0px;
    width: 100%;
    color: white;
    padding: 10px;
    text-align: center;
    background: linear-gradient(to bottom left, #fcb225, #ff5c6c);
`;

class Notification extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.common.error) return null;

        return <div className={notification}>{this.props.common.error}</div>;
    }
}

const mapStateToProps = (state) => ({
    common: state.common,
});

const mapDispatchToProps = (dispatch) => ({
    hydrateError: (payload) => {
        dispatch(error(payload));
    },
});

export const NotificationComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Notification);
