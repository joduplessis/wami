import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  DatePickerIOS
} from "react-native";
import { connect } from "react-redux";
import { ParentModal } from "./ParentModal";

const moment = require("moment-timezone");

class DateModalRC extends React.Component {
  constructor(props) {
    super(props);

    this.closeCallback = this.closeCallback.bind(this);
    this.selectCallback = this.selectCallback.bind(this);
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.props.updateCallback(newDate);
  }

  selectCallback() {
    this.props.selectCallback();
  }

  closeCallback() {
    this.props.closeCallback();
  }

  componentDidUpdate() {}

  render() {
    const { width, height } = Dimensions.get("screen");
    const datetime = this.props.datetime ? this.props.datetime : "date";
    const date = moment(this.props.date)
      .tz(this.props.account.timezone)
      .toDate();
    const offset = moment(this.props.date)
      .tz(this.props.account.timezone)
      .utcOffset();

    return (
      <ParentModal
        visible={this.props.visible}
        title="Date"
        confirmCallback={this.props.closeCallback}
        closeCallback={this.props.closeCallback}
        height={350}
      >
        <DatePickerIOS
          date={date}
          onDateChange={this.setDate}
          mode={datetime}
          timeZoneOffsetInMinutes={offset}
          style={{ width: width - 50, height: 200 }}
        />
      </ParentModal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const DateModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(DateModalRC);
