import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
    ToolbarComponent,
    ContactsComponent,
    HeadingComponent,
} from "../components";

class Contacts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <ToolbarComponent>
                    <HeadingComponent title="Contacts" />

                    <div style={{ flex: 1 }}></div>
                </ToolbarComponent>

                <ContactsComponent />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export const ContactsPage = connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts);
