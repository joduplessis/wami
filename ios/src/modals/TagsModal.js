import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
  Modal
} from "react-native";
import { connect } from "react-redux";
import { TagComponent } from "../components";
import { ParentModal } from "./ParentModal";

class TagsModalRC extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = Dimensions.get("screen").width;

    return (
      <ParentModal
        visible={this.props.visible}
        title="Select category"
        confirmCallback={this.props.closeCallback}
        closeCallback={this.props.closeCallback}
        height={350}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            flexDirection: "row",
            flexWrap: "wrap"
          }}
        >
          <View style={{ width, flexDirection: "row", flexWrap: "wrap" }}>
            {this.props.common.tags.map((tag, index) => {
              return (
                <TagComponent
                  text={tag.name}
                  current={
                    this.props.current
                      ? tag._id == this.props.current._id
                      : false
                  }
                  key={index}
                  selectCallback={() => {
                    this.props.selectCallback(tag);
                    this.props.closeCallback();
                  }}
                />
              );
            })}
          </View>
        </ScrollView>
      </ParentModal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({});

export const TagsModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(TagsModalRC);
