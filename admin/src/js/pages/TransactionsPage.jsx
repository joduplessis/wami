import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    ToolbarComponent,
    HeadingComponent,
    TransactionsComponent,
} from "../components";

class Transactions extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <ToolbarComponent>
                    <HeadingComponent title="Transactions" />

                    <div style={{ flex: 1 }}></div>
                </ToolbarComponent>

                <TransactionsComponent />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export const TransactionsPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Transactions);
