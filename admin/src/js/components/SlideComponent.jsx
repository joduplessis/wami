import React, { Component } from "react";
import { ButtonComponent } from "./ButtonComponent";

class Slide extends Component {
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
        const width = this.state.visible ? this.props.width : 0;
        const position =
            this.props.position == "left" ? { left: 0 } : { right: 0 };

        return (
            <div
                style={{
                    ...position,
                    display: "block",
                    position: "absolute",
                    top: 0,
                    height: "100%",
                    width: "100%",
                    zIndex: 203,
                }}
            >
                <div
                    onClick={this.animateOut}
                    style={{
                        ...position,
                        opacity,
                        transition: "opacity 0.5s",
                        display: "block",
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        width: "100%",
                        backgroundColor: "black",
                        zIndex: 203,
                        cursor: "pointer",
                    }}
                />

                <div
                    style={{
                        ...position,
                        width,
                        transition: "width 0.5s",
                        display: "block",
                        overflow: "hidden",
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        zIndex: 203,
                        backgroundColor: "white",
                    }}
                >
                    <div
                        style={{
                            ...position,
                            width,
                            position: "absolute",
                            top: 0,
                            height: "100%",
                            zIndex: 203,
                            overflow: "scroll",
                        }}
                    >
                        <div style={{ padding: 20 }}>{this.props.children}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export const SlideComponent = Slide;
