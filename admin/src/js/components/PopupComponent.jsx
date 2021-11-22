import React, { Component } from "react";
import { ButtonComponent } from "./ButtonComponent";

class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
        };

        this.animateIn = this.animateIn.bind(this);
        this.animateOut = this.animateOut.bind(this);
    }

    componentDidMount() {
        if (this.props.visible) {
            this.animateIn();
        }
    }

    animateIn() {
        setTimeout(() => {
            this.setState({ visible: true });
        }, 100);
    }

    animateOut() {
        this.setState({
            visible: false,
        });

        setTimeout(() => {
            this.props.closeCallback();
        }, 500);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.visible != this.props.visible) {
            if (nextProps.visible) {
                this.animateIn();
            } else {
                this.animateOut();
            }
        }
    }

    render() {
        if (!this.props.visible) return null;

        const opacity = this.state.visible ? 0.25 : 0;
        const opacityPopup = this.state.visible ? 1 : 0;

        return (
            <div
                style={{
                    display: "block",
                    position: "absolute",
                    right: 0,
                    top: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 1000,
                }}
            >
                <div
                    onClick={this.animateOut}
                    style={{
                        transition: "opacity 0.5s",
                        display: "block",
                        position: "absolute",
                        right: 0,
                        top: 0,
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black",
                        opacity,
                        zIndex: 203,
                        cursor: "pointer",
                    }}
                />

                <div
                    style={{
                        borderRadius: 0,
                        backgroundColor: "white",
                        opacity: opacityPopup,
                        transition: "opacity 0.25s",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translateY(-50%) translateX(-50%)",
                        height: this.props.height,
                        width: this.props.width,
                        zIndex: 203,
                    }}
                >
                    <div style={{ padding: 20 }}>{this.props.children}</div>
                </div>
            </div>
        );
    }
}

export const PopupComponent = Popup;
