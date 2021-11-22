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
import Icon from "react-native-vector-icons/Feather";
import {
  ContactComponent,
  FilterComponent,
  SectionHeadingComponent
} from "../components";
import { loading, error } from "../actions";

class GroupMembersModalRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts_filter: ""
    };

    this.updateContactsFilter = this.updateContactsFilter.bind(this);
  }

  updateContactsFilter(term) {
    this.setState({
      contacts_filter: term
    });

    if (term != "") {
      this.userSearch(term);
    } else {
      this.setState({
        users: []
      });
    }
  }

  render() {
    const { width, height } = Dimensions.get("screen");

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.closeCallback();
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
            <View
              style={{
                padding: 20,
                paddingTop: 40,
                borderBottomWidth: 2,
                borderColor: "#eef2f5",
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center"
              }}
            >
              <Icon name="users" size={19} color="#424E5E" />

              <Text
                style={{
                  flex: 1,
                  paddingLeft: 10,
                  fontSize: 15,
                  color: "#424E5E",
                  fontWeight: "800"
                }}
              >
                ADD PERSON
              </Text>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
                onPress={() => {
                  this.setState({
                    contacts_filter: "",
                    users: []
                  });
                  this.props.closeCallback();
                }}
              >
                <Icon name="x" size={24} color="#424E5E" />
              </TouchableOpacity>
            </View>

            <FilterComponent
              action={this.updateContactsFilter}
              text={this.state.contacts_filter}
              style={{ backgroundColor: "#EEF1F7" }}
              placeholder="Find People"
            />

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingTop: 10 }}
            >
              <View style={{ width }}>
                <SectionHeadingComponent title="People" />

                {this.props.contacts.map((contact, index) => {
                  const re = new RegExp(this.state.contacts_filter + ".*");
                  const _id =
                    contact.contact._id == this.props.account._id
                      ? contact.user._id
                      : contact.contact._id;
                  const name =
                    contact.contact._id == this.props.account._id
                      ? contact.user.name
                      : contact.contact.name;

                  let show = true;

                  // If this contact is part of the exclusion list
                  // Served through the props, via the groups modal
                  // then don't show it
                  this.props.exclude.map((c, _) => {
                    if (c._id == _id) show = false;

                    return;
                  });

                  // Follower.contact because we the contact user
                  // We also check against exist contacts so we don't have users
                  // Adding twice
                  if (name.match(re) && show) {
                    return (
                      <ContactComponent
                        key={index}
                        name={name}
                        color={
                          contact.contact._id == this.props.account._id
                            ? contact.user.color
                            : contact.contact.color
                        }
                        image={
                          contact.contact._id == this.props.account._id
                            ? contact.user.image
                            : contact.contact.image
                        }
                        label={null}
                        button="Add"
                        buttonAction={() => this.props.selectCallback(_id)}
                        action={null}
                      />
                    );
                  }
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  contacts: state.contacts,
  groups: state.groups,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  updateError: payload => {
    dispatch(error(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  }
});

export const GroupMembersModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupMembersModalRC);
