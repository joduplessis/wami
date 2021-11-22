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
  Picker
} from "react-native";
import { connect } from "react-redux";
import { ParentModal } from "./ParentModal";

const moment = require("moment-timezone");

class ExpiryModalRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      months: [],
      years: []
    };
  }

  componentDidMount() {
    this.setState({
      months: moment.monthsShort(),
      years: [
        moment().format("YYYY"),
        moment()
          .add(1, "years")
          .format("YYYY"),
        moment()
          .add(2, "years")
          .format("YYYY"),
        moment()
          .add(3, "years")
          .format("YYYY"),
        moment()
          .add(4, "years")
          .format("YYYY"),
        moment()
          .add(5, "years")
          .format("YYYY"),
        moment()
          .add(6, "years")
          .format("YYYY"),
        moment()
          .add(7, "years")
          .format("YYYY")
      ]
    });
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <ParentModal
        visible={this.props.visible}
        title="Expiry date"
        confirmCallback={this.props.closeCallback}
        closeCallback={this.props.closeCallback}
        height={350}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center"
          }}
        >
          <Picker
            selectedValue={this.props.month}
            style={{ height: 300, flex: 1 }}
            onValueChange={(itemValue, itemIndex) => {
              this.props.updateMonthCallback(itemValue);
            }}
          >
            {this.state.months.map((month, index) => {
              return (
                <Picker.Item
                  label={`${index + 1}`}
                  value={`${index + 1}`}
                  key={index}
                />
              );
            })}
          </Picker>

          <Picker
            selectedValue={this.props.year}
            style={{ height: 300, flex: 1 }}
            onValueChange={(itemValue, itemIndex) => {
              this.props.updateYearCallback(itemValue);
            }}
          >
            {this.state.years.map((year, index) => {
              return <Picker.Item label={year} value={year} key={index} />;
            })}
          </Picker>
        </View>
      </ParentModal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const ExpiryModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExpiryModalRC);
