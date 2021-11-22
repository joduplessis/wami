import React, { Component } from "react";

class TextButton extends Component {
    render() {
        return (
            <div
                onClick={this.props.action}
                className="text-button"
                style={this.props.style}
            >
                {this.props.children}
                {this.props.text && (
                    <span className="text">{this.props.text}</span>
                )}
            </div>
        );
    }
}

export const TextButtonComponent = TextButton;
