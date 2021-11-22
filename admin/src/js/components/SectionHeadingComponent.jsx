import React, { Component } from "react";

class SectionHeading extends Component {
    render() {
        const alignItems = this.props.align == "left" ? "flex-start" : "center";
        return (
            <div
                style={{
                    marginBottom: 15,
                    marginTop: 25,
                    display: "flex",
                    flexDirection: "column",
                    alignItems,
                    alignContent: "center",
                    justifyContent: "center",
                    ...this.props.style,
                }}
            >
                <span
                    style={{ color: "#1F2D3D", fontSize: 15, fontWeight: 700 }}
                >
                    {this.props.title}
                </span>

                {this.props.subtitle && (
                    <span
                        style={{
                            color: "#C3C3C3",
                            fontSize: 10,
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

export const SectionHeadingComponent = SectionHeading;
