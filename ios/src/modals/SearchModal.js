import React from "react";
import {
  KeyboardAvoidingView,
  View,
  TextInput,
  Image,
  Dimensions,
  Modal,
  ScrollView
} from "react-native";
import {
  ButtonComponent,
  IconComponent,
  HeadingComponent,
  SubheadingComponent
} from "../components";
import { connect } from "react-redux";
import { COLORS } from "../helpers";

class SearchRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tag: "",
      term: "",
      tags: []
    };

    this.clearFields = this.clearFields.bind(this);
  }

  clearFields() {
    this.setState({
      tag: "",
      term: "",
      tags: []
    });
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          // Dismiss the modal
          this.props.closeCallback();

          // Reset the wizard
          this.clearFields();
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.85)",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center"
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              position: "relative",
              width,
              height,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                width,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <Image
                style={{
                  zIndex: 0,
                  width,
                  height: 300,
                  position: "relative",
                  top: -100,
                  right: 0,
                  marginBottom: -200,
                  marginTop: -70
                }}
                source={require("../../assets/images/headers/04.png")}
                resizeMode="contain"
              />

              <KeyboardAvoidingView
                style={{
                  zIndex: 6,
                  width,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <View
                  style={{
                    zIndex: 8,
                    width,
                    flexDirection: "row",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                    padding: 20,
                    paddingTop: 40,
                    marginBottom: 40
                  }}
                >
                  <IconComponent
                    size={26}
                    name="x"
                    color={COLORS.LIGHT.v1}
                    action={() => {
                      // Dismiss the modal
                      this.props.closeCallback();

                      // Reset the wizard
                      this.clearFields();
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center"
                  }}
                >
                  <SubheadingComponent
                    title="Partner up with someone who can help"
                    color={COLORS.DARK.v6}
                    style={{ padding: 20, paddingBottom: 5 }}
                  />

                  <HeadingComponent
                    text="Simply enter a keyword to search for & select a category. You can search for all coaches in a category by simply leaving the text field blank."
                    color={COLORS.DARK.v4}
                    numberOfLines={5}
                    size={16}
                    style={{ textAlign: "center", padding: 20 }}
                  />

                  <View
                    style={{
                      padding: 20,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    <TextInput
                      value={this.state.term}
                      placeholder="Pre diabetes"
                      placeholderTextColor={COLORS.LIGHT.v4}
                      style={{
                        fontSize: 30,
                        flex: 1,
                        color: COLORS.DARK.v3,
                        textAlign: "center"
                      }}
                      onChangeText={term => this.setState({ term })}
                    />
                  </View>

                  <View
                    style={{
                      padding: 20,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    {this.props.common.tags.map((tag, index) => {
                      const selected = this.state.tag == tag._id;
                      const color = selected ? COLORS.DARK.v3 : COLORS.LIGHT.v5;

                      return (
                        <ButtonComponent
                          key={index}
                          title={tag.name}
                          style={{ margin: 2 }}
                          color={color}
                          action={() => this.setState({ tag: tag._id })}
                        />
                      );
                    })}
                  </View>

                  <View
                    style={{
                      marginTop: 20,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      flexWrap: "wrap"
                    }}
                  >
                    <ButtonComponent
                      title="Search"
                      solid={true}
                      color={COLORS.DARK.v5}
                      action={() => {
                        // Easier to get our vars like this
                        const { tag, term } = this.state;

                        // They can't be null
                        if (tag == "" && term == "") return null;

                        // Call our parent function
                        this.props.searchCallback(tag, term);
                      }}
                    />
                  </View>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const SearchModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchRC);
