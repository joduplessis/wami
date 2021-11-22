import React from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  Modal
} from "react-native";
import { SectionHeadingComponent } from "../components";
import { ParentModal, ExpiryModal } from "./";
import { COLORS } from "../helpers";

const moment = require("moment-timezone");

export class CardModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date_modal: false,
      loading: false,
      error: false,
      //name: 'J B du plessis',
      //number: '4009745001542342',
      //cvv: '334',
      //vendor: 'VISA',
      name: "",
      number: "",
      cvv: "",
      vendor: "",
      month: moment()
        .add(5, "months")
        .month(),
      year: moment().year()
    };

    this.registerCard = this.registerCard.bind(this);
    this.updateMonth = this.updateMonth.bind(this);
    this.updateYear = this.updateYear.bind(this);
  }

  registerCard() {
    this.props.updateCard({
      name: this.state.name,
      number: this.state.number,
      cvv: this.state.cvv,
      month:
        this.state.month < 10 ? `0${this.state.month}` : `${this.state.month}`,
      year: this.state.year,
      vendor: this.state.vendor
    });
  }

  updateMonth(month) {
    this.setState({
      month
    });
  }

  updateYear(year) {
    this.setState({
      year
    });
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <ParentModal
        visible={this.props.visible}
        title="Card details"
        confirmCallback={this.registerCard}
        closeCallback={this.props.closeCallback}
        height={300}
      >
        <ExpiryModal
          visible={this.state.date_modal}
          closeCallback={() => this.setState({ date_modal: false })}
          updateMonthCallback={this.updateMonth}
          updateYearCallback={this.updateYear}
          year={this.state.year}
          month={this.state.month}
        />

        <ScrollView
          style={{ zIndex: 6, flex: 1, backgroundColor: "white" }}
          contentContainerStyle={{
            padding: 0,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          {this.state.loading && (
            <Text
              style={{
                width,
                padding: 20,
                paddingTop: 20,
                paddingBottom: 10,
                color: "#25D5A1",
                fontSize: 12,
                fontWeight: "800"
              }}
            >
              ADDING CARD...
            </Text>
          )}

          {this.state.error && (
            <Text
              style={{
                width,
                padding: 20,
                paddingTop: 20,
                paddingBottom: 10,
                color: "#ED4A70",
                fontSize: 12,
                fontWeight: "800"
              }}
            >
              THIS IS NOT A VALID CARD
            </Text>
          )}

          <SectionHeadingComponent
            title="Name on Card"
            style={{ padding: 20, paddingBottom: 10 }}
          />

          <TextInput
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
            placeholder="Name on card"
            style={{
              width,
              paddingLeft: 20,
              color: "#424E5E",
              fontSize: 22,
              fontWeight: "500",
              paddingBottom: 10
            }}
          />

          <SectionHeadingComponent
            title="Card Number"
            style={{ padding: 20, paddingBottom: 10 }}
          />

          <TextInput
            value={this.state.number}
            onChangeText={number => this.setState({ number })}
            placeholder="Card number"
            style={{
              width,
              paddingLeft: 20,
              color: "#424E5E",
              fontSize: 22,
              fontWeight: "500",
              paddingBottom: 10
            }}
          />

          <SectionHeadingComponent
            title="Expiry Date"
            style={{ padding: 20, paddingBottom: 10 }}
            more={true}
            moreText=" "
            icon="edit-2"
            action={() => this.setState({ date_modal: true })}
          />

          <TextInput
            value={`${this.state.month}/${this.state.year}`}
            placeholder="Expiry date"
            style={{
              width,
              paddingLeft: 20,
              color: "#424E5E",
              fontSize: 22,
              fontWeight: "500",
              paddingBottom: 10
            }}
          />

          <SectionHeadingComponent
            color="#ED4A70"
            title="CVV"
            style={{ padding: 20, paddingBottom: 10 }}
          />

          <TextInput
            value={this.state.cvv}
            onChangeText={cvv => this.setState({ cvv })}
            placeholder="CVV number"
            style={{
              width,
              paddingLeft: 20,
              color: "#ED4A70",
              fontSize: 22,
              fontWeight: "500",
              paddingBottom: 10
            }}
          />

          <SectionHeadingComponent
            color="#ED4A70"
            title="Card Vendor"
            style={{ padding: 20, paddingBottom: 10 }}
          />

          <View
            style={{
              width,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => this.setState({ vendor: "MASTERCARD" })}
              style={{ flex: 1 }}
            >
              <Image
                style={{
                  zIndex: 0,
                  width: width / 2 - 30,
                  height: 50,
                  opacity: this.state.vendor == "MASTERCARD" ? 1 : 0.25
                }}
                source={require("../../assets/images/mastercard.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.setState({ vendor: "VISA" })}
              style={{ flex: 1 }}
            >
              <Image
                style={{
                  zIndex: 0,
                  width: width / 2 - 30,
                  height: 50,
                  opacity: this.state.vendor == "VISA" ? 1 : 0.25
                }}
                source={require("../../assets/images/visa.png")}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ParentModal>
    );
  }
}
