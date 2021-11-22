import React, { Component } from "react";
import { S3_PATH } from "../helpers";

class Avatar extends Component {
    render() {
        const { width, height } = this.props;
        const borderColor = this.props.borderColor
            ? this.props.borderColor
            : "#0facf3";
        const border = this.props.borderWidth
            ? `${this.props.borderWidth}px solid ${borderColor}`
            : `1px solid ${borderColor}`;
        const containerSize = this.props.borderWidth
            ? this.props.borderWidth * 2
            : 2;

        const stylesContainer = Object.assign(
            {
                background: "transparent",
                width: width + containerSize,
                height: height + containerSize,
                borderRadius: 200,
                border,
                overflow: "hidden",
                position: "relative",
            },
            this.props.style
        );

        const styles = {
            background: this.props.src
                ? `transparent url(${S3_PATH}${this.props.src}) no-repeat center center`
                : borderColor,
            width: width - 2,
            height: height - 2,
            borderRadius: 200,
            position: "absolute",
            bottom: 1,
            left: 1,
        };

        return (
            <div style={stylesContainer}>
                <div
                    style={styles}
                    onClick={this.props.action}
                    className="background_cover"
                ></div>
            </div>
        );
    }
}

export const AvatarComponent = Avatar;
