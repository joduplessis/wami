import React from "react";
import { Dimensions, Picker } from "react-native";
import { connect } from "react-redux";
import { ParentModal } from "./ParentModal";

const moment = require("moment-timezone");

class TimezoneModalRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timezones: []
    };
  }

  componentDidMount() {
    this.setState({
      timezones: moment.tz.names()
    });
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <ParentModal
        visible={this.props.visible}
        title="Timezones"
        confirmCallback={this.props.closeCallback}
        closeCallback={this.props.closeCallback}
        height={350}
      >
        <Picker
          selectedValue={this.props.timezone}
          style={{ height: 300, width }}
          onValueChange={(itemValue, itemIndex) => {
            this.props.updateCallback(itemValue);
          }}
        >
          {this.state.timezones.map((timezone, index) => {
            return (
              <Picker.Item
                label={timezone.replace("_", " ")}
                value={timezone}
                key={index}
              />
            );
          })}
        </Picker>
      </ParentModal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const TimezoneModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(TimezoneModalRC);
