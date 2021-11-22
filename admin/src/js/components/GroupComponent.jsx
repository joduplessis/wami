import * as React from "react";

class Group extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    ...this.props.style,
                }}
            >
                {this.props.children}
            </div>
        );
    }
}

export const GroupComponent = Group;
