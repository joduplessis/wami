import React from "react";
import { connect } from "react-redux";

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    padding: 10,
                    paddingRight: 20,
                    paddingLeft: 20,
                    backgroundColor: "white",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    calendar: state.calendar,
    events: state.events,
});

const mapDispatchToProps = (dispatch) => ({});

export const ToolbarComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Toolbar);
