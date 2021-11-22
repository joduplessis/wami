import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AvatarComponent } from "./";

class Contact extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Link
                to="/messaging"
                style={{
                    paddingBottom: 10,
                    position: "relative",
                    textDecoration: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                }}
            >
                <AvatarComponent
                    width={20}
                    height={20}
                    src={this.props.src}
                    borderWidth={2}
                />

                <div
                    style={{
                        paddingLeft: 10,
                        textDecoration: "none",
                        color: "#718093",
                        fontSize: 14,
                        fontWeight: 500,
                    }}
                >
                    {this.props.name}
                </div>

                <div
                    style={{
                        flex: 1,
                        paddingLeft: 10,
                        color: "#424E5E",
                        fontSize: 10,
                        fontWeight: 400,
                    }}
                >
                    {this.props.title}
                </div>
            </Link>
        );
    }
}

const mapStateToProps = (state) => ({
    common: state.common,
});

const mapDispatchToProps = (dispatch) => ({});

export const ContactComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Contact);
