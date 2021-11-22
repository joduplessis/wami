import React, { Component } from "react";

class Heading extends Component {
    render() {
        const alignItems = this.props.align == "left" ? "flex-start" : "center";
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems,
                    alignContent: "center",
                    justifyContent: "center",
                    ...this.props.style,
                }}
            >
                <span
                    style={{ color: "#1F2D3D", fontSize: 32, fontWeight: 400 }}
                >
                    {this.props.title}
                </span>

                {this.props.subtitle && (
                    <span
                        style={{
                            color: "#C3C3C3",
                            fontSize: 12,
                            fontWeight: 500,
                        }}
                    >
                        {this.props.subtitle}
                    </span>
                )}
            </div>
        );
    }
}

export const HeadingComponent = Heading;
