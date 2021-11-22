import React, { Component } from "react";

class Button extends Component {
    render() {
        const selected = this.props.selected ? "selected" : "";
        const inverted = this.props.inverted ? "inverted" : "";

        return (
            <div
                className={`button ${selected} ${inverted}`}
                onClick={this.props.action}
                style={this.props.style}
            >
                {this.props.icon}

                <div className="text">{this.props.text}</div>
            </div>
        );
    }
}

export const ButtonComponent = Button;
