import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  TextInput,
  Slider,
  AsyncStorage,
  KeyboardAvoidingView,
  SegmentedControlIOS,
  DatePickerAndroid,
  Platform
} from "react-native";
import SegmentedControlTab from "react-native-segmented-control-tab";
import { connect } from "react-redux";
import { SectionHeadingComponent, ColorComponent } from "../components";
import {
  ColorModal,
  CardModal,
  DateModal,
  CountryModal,
  TimezoneModal
} from "../modals";
import Icon from "react-native-vector-icons/Feather";
import {
  loading,
  menu,
  error,
  updateContact,
  account,
  dehydrations
} from "../actions";
import {
  S3_PATH,
  API_PATH,
  COLORS,
  GQL,
  MQTT,
  USER,
  FONT,
  CONTACT,
  EVENT,
  CHANNEL,
  STORAGE_KEY_LOGGEDIN,
  uploadFile
} from "../helpers";
import ImagePicker from "react-native-image-crop-picker";

class ProfileScreenRC extends React.Component {
  genders = ["Male", "Female", "Other"];
  ethinicities = ["White", "Black", "Indian", "Coloured"];

  constructor(props) {
    super(props);

    this.state = {
      color_modal: false,
      country_modal: false,
      card_modal: false,
      date_modal: false,
      timezone_modal: false,
      edit: false,
      _id: null,
      email: "",
      name: "",
      image: null,
      contact: "",
      country: "",
      title: null,
      dob: null,
      color: "#2CD1C0",
      card: "",
      token: "",
      timezone: "",
      plan: 0,
      weight: 0,
      height: 0,
      ethnicity: "",
      gender: ""
    };

    this.toggleColor = this.toggleColor.bind(this);
    this.toggleCountry = this.toggleCountry.bind(this);
    this.toggleTimezone = this.toggleTimezone.bind(this);
    this.toggleCard = this.toggleCard.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.selectTimezone = this.selectTimezone.bind(this);
    this.updateTimezone = this.updateTimezone.bind(this);
    this.toggleDate = this.toggleDate.bind(this);
    this.selectDate = this.selectDate.bind(this);
    this.updateDate = this.updateDate.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.updateCountry = this.updateCountry.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.saveProfileData = this.saveProfileData.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.logout = this.logout.bind(this);
    this.deregisterCard = this.deregisterCard.bind(this);
    this.openAndroidDateModal = this.openAndroidDateModal.bind(this);
  }

  deregisterCard() {
    this.props.updateLoading(true);

    fetch(`${API_PATH}/user/${this.state._id}/card/deregister`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      }
    })
      .then(response => {
        const statusCode = response.status;
        const res = response.json();

        return Promise.all([statusCode, res]);
      })
      .then(([statusCode, res]) => {
        if (statusCode != 200) {
          this.props.updateLoading(false);
          this.props.updateError(true);
          return;
        }

        this.props.updateLoading(false);
        this.props.updateError(false);
        this.props.updateAccount({ card: null });
        this.setState({ card: null });
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(true);
      });
  }

  toggleTimezone() {
    this.setState({
      timezone_modal: !this.state.timezone_modal
    });
  }

  toggleCountry() {
    this.setState({
      country_modal: !this.state.country_modal
    });
  }

  toggleCard() {
    this.setState({
      card_modal: !this.state.card_modal
    });
  }

  toggleColor() {
    this.setState({
      color_modal: !this.state.color_modal
    });
  }

  updateImage() {
    ImagePicker.openPicker({
      width: 500,
      height: 800,
      cropping: true
    })
      .then(response => {
        const { filename, sourceURL, path } = response;
        const { _id } = this.props.account;
        const filenameForIosAndAndroid = Platform.OS == "ios" ? filename : path.split('/')[path.split('/').length - 1];
        const key = `${USER}/${_id}/${filenameForIosAndAndroid}`;

        this.props.updateLoading(true);

        uploadFile(filenameForIosAndAndroid, path, key)
          .then(result => {
            this.props.updateLoading(false);
            this.setState({
              loading: null,
              image: key,
              edit: true
            });
          })
          .catch(err => {
            this.props.updateLoading(false);
            // If the user cancels -> this.props.updateError(err);
          });
      })
      .catch(err => {
        this.props.updateLoading(false);
        // If the user cancels -> this.props.updateError(err);
      });
  }

  componentDidMount() {
    this.fetchScreen();
  }

  fetchScreen() {
    this.props.updateLoading(true);

    GQL.fetchUser(this.props.account._id, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { user } = result.data;

        const {
          _id,
          email,
          name,
          image,
          contact,
          title,
          country,
          dob,
          color,
          card,
          token,
          timezone,
          plan,
          weight,
          height,
          ethnicity,
          gender
        } = user;

        this.setState({
          _id,
          email,
          name,
          image,
          contact,
          title,
          country,
          dob: new Date(dob),
          color,
          card,
          token,
          timezone,
          plan,
          weight,
          height,
          ethnicity: this.ethinicities.indexOf(ethnicity),
          gender: this.genders.indexOf(gender)
        });

        this.props.updateAccount(user);
        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  saveProfileData() {
    this.props.updateLoading(true);

    fetch(`${API_PATH}/user/${this.state._id}`, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.common.token}`
      },
      body: JSON.stringify({
        _id: this.state._id,
        email: this.state.email,
        name: this.state.name,
        image: this.state.image,
        contact: this.state.contact,
        country: this.state.country,
        title: this.state.title,
        dob: this.state.dob,
        color: this.state.color,
        card: this.state.card,
        token: this.state.token,
        timezone: this.state.timezone,
        weight: this.state.weight,
        height: this.state.height,
        ethnicity: this.ethinicities[this.state.ethnicity],
        gender: this.genders[this.state.gender]
      })
    })
      .then(response => response.json())
      .then(data => {
        const {
          _id,
          email,
          name,
          title,
          image,
          contact,
          country,
          dob,
          color,
          card,
          token,
          timezone
        } = this.state;

        // Update all our contact with the new info
        // This is one of the only dispatches that are different to the rest
        // We're expicitly updating ON WILL
        // We do not need to receive this as we are never the contact data we need
        this.props.contacts.map(userContact => {
          this.props.updateContact(MQTT.topic(CONTACT, userContact._id), {
            _id: userContact._id,
            user: {
              _id,
              name,
              image,
              title,
              color
            }
          });
        });

        this.props.updateAccount({
          _id,
          email,
          name,
          title,
          image,
          contact,
          country,
          dob,
          color,
          card,
          token,
          timezone
        });

        this.props.updateLoading(false);
        this.setState({ edit: false });
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(true);
        this.setState({ edit: false });
      });
  }

  updateCard(card) {
    this.setState({
      card
    });
  }

  updateTimezone(timezone) {
    this.setState({
      edit: true,
      timezone
    });
  }

  selectTimezone(timezone) {
    this.setState({
      edit: true,
      timezone_modal: false
    });
  }

  updateCountry(country) {
    this.setState({
      edit: true,
      country
    });
  }

  selectCountry(country) {
    this.setState({
      edit: true,
      country_modal: false
    });
  }

  updateDate(dob) {
    this.setState({
      edit: true,
      dob
    });
  }

  selectDate(dob) {
    this.updateDate(dob);
    this.setState({
      edit: true,
      date_modal: false
    });
  }

  toggleDate() {
    if (Platform.OS == "android") this.openAndroidDateModal();
    if (Platform.OS == "ios") {
      this.setState({
        date_modal: !this.state.date_modal
      });
    }
  }

  async openAndroidDateModal() {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: this.state.dob
      });

      if (action !== DatePickerAndroid.dismissedAction)
        this.updateDate(new Date(year, month, day));
    } catch ({ code, message }) {}
  }

  selectColor(color) {
    this.setState({
      color,
      edit: true,
      color_modal: false
    });
  }

  logout() {
    this.props.updateLoading(true);
    this.props.updateError(false);
    this.props.dehydrations(this.state._id);

    // Remove this token
    AsyncStorage.removeItem(STORAGE_KEY_LOGGEDIN)
      .then(res => {
        this.props.updateLoading(false);

        // Update our account to be blank
        this.props.updateAccount({
          _id: null,
          email: null,
          name: null,
          title: null,
          image: null
        });

        // Move back to the login
        this.props.navigation.navigate("Signin");
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(true);
      });
  }

  render() {
    const { height, width } = Dimensions.get("screen");

    if (!this.state._id) {
      return null;
    }

    return (
      <View style={{ flex: 1 }}>
        <CountryModal
          visible={this.state.country_modal}
          closeCallback={this.toggleCountry}
          selectCallback={this.selectCountry}
          updateCallback={this.updateCountry}
          country={this.state.country}
        />

        <TimezoneModal
          visible={this.state.timezone_modal}
          closeCallback={this.toggleTimezone}
          selectCallback={this.selectTimezone}
          updateCallback={this.updateTimezone}
          timezone={this.state.timezone}
        />

        <DateModal
          visible={this.state.date_modal}
          closeCallback={this.toggleDate}
          selectCallback={this.selectDate}
          updateCallback={this.updateDate}
          date={this.state.dob}
          datetime="date"
        />

        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              zIndex: 3,
              padding: 20,
              paddingTop: 40,
              width,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                marginLeft: 0,
                padding: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
              onPress={this.updateImage}
            >
              <Icon name="image" size={22} color={this.state.color} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                marginLeft: 10,
                padding: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
              onPress={() => this.props.navigation.navigate("Transactions")}
            >
              <Icon name="credit-card" size={22} color={this.state.color} />
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            {this.state.edit && (
              <TouchableOpacity
                style={{
                  marginLeft: 10,
                  padding: 5,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
                onPress={this.saveProfileData}
              >
                <Icon name="save" size={22} color={this.state.color} />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={{
                marginLeft: 10,
                padding: 5,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
              onPress={this.logout}
            >
              <Icon name="log-out" size={20} color={this.state.color} />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
            <ScrollView
              style={{ zIndex: 3, flex: 1 }}
              contentContainerStyle={{ width, paddingBottom: 50 }}
            >
              <View
                style={{
                  zIndex: 400,
                  width,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <View
                  style={{
                    borderWidth: 10,
                    borderColor: "white",
                    width: 150,
                    height: 150,
                    backgroundColor: this.state.color,
                    borderRadius: 75,
                    padding: 10
                  }}
                >
                  <Image
                    style={{
                      zIndex: 1,
                      position: "relative",
                      width: 110,
                      height: 110,
                      borderRadius: 55
                    }}
                    source={{ uri: `${S3_PATH}${this.state.image}` }}
                  />
                </View>
              </View>

              <SectionHeadingComponent
                title="Name"
                style={{ paddingBottom: 10 }}
              />

              <TextInput
                placeholder="Name"
                value={this.state.name}
                onChangeText={text => this.setState({ name: text, edit: true })}
                style={{
                  width,
                  paddingLeft: 20,
                  color: "#424E5E",
                  fontSize: 22,
                  fontFamily: FONT,
                  fontWeight: "500"
                }}
              />

              <SectionHeadingComponent
                title="Email"
                style={{ paddingBottom: 10 }}
              />

              <TextInput
                placeholder="Email"
                value={this.state.email}
                onChangeText={text =>
                  this.setState({ email: text, edit: true })
                }
                style={{
                  width,
                  paddingLeft: 20,
                  color: "#424E5E",
                  fontSize: 22,
                  fontFamily: FONT,
                  fontWeight: "500"
                }}
              />

              {this.state.plan != 0 && (
                <SectionHeadingComponent
                  title="Title"
                  style={{ paddingBottom: 10 }}
                />
              )}

              {this.state.plan != 0 && (
                <TextInput
                  placeholder="Title"
                  value={this.state.title}
                  onChangeText={text =>
                    this.setState({ title: text, edit: true })
                  }
                  style={{
                    width,
                    paddingLeft: 20,
                    color: "#424E5E",
                    fontSize: 22,
                    fontFamily: FONT,
                    fontWeight: "500"
                  }}
                />
              )}

              <SectionHeadingComponent
                title="Contact Number"
                style={{ paddingBottom: 10 }}
              />

              <TextInput
                placeholder="Contact"
                value={this.state.contact}
                onChangeText={text =>
                  this.setState({ contact: text, edit: true })
                }
                style={{
                  width,
                  paddingLeft: 20,
                  color: "#424E5E",
                  fontSize: 22,
                  fontFamily: FONT,
                  fontWeight: "500"
                }}
              />

              <SectionHeadingComponent
                title="Country"
                style={{ paddingBottom: 10 }}
                icon="edit-2"
                more={true}
                moreText=" "
                action={this.toggleCountry}
              />

              <TextInput
                placeholder="Country"
                value={this.state.country}
                editable={false}
                style={{
                  width,
                  paddingLeft: 20,
                  color: "#424E5E",
                  fontSize: 22,
                  fontFamily: FONT,
                  fontWeight: "500"
                }}
              />

              <SectionHeadingComponent
                title="Timezone"
                style={{ paddingBottom: 10 }}
                icon="edit-2"
                more={true}
                moreText=" "
                action={this.toggleTimezone}
              />

              <TextInput
                placeholder="Timezone"
                value={this.state.timezone.replace("_", " ")}
                editable={false}
                style={{
                  width,
                  paddingLeft: 20,
                  color: "#424E5E",
                  fontSize: 22,
                  fontFamily: FONT,
                  fontWeight: "500"
                }}
              />

              <SectionHeadingComponent
                title="Date Of Birth"
                style={{ paddingBottom: 10 }}
                icon="edit-2"
                more={true}
                moreText=" "
                action={this.toggleDate}
              />

              <TextInput
                placeholder="Date of birth"
                editable={false}
                value={
                  this.state.dob ? this.state.dob.toLocaleDateString() : ""
                }
                style={{
                  width,
                  paddingLeft: 20,
                  color: "#424E5E",
                  fontSize: 22,
                  fontFamily: FONT,
                  fontWeight: "500"
                }}
              />

              <SectionHeadingComponent
                title="Gender"
                style={{ paddingBottom: 10 }}
              />

              <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                <SegmentedControlTab
                  tintColor={this.state.color}
                  values={this.genders}
                  selectedIndex={this.state.gender}
                  onTabPress={index => {
                    this.setState({
                      gender: index,
                      edit: true
                    });
                  }}
                />
              </View>

              <SectionHeadingComponent
                title="Ethinicity"
                style={{ paddingBottom: 10 }}
              />

              <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                <SegmentedControlTab
                  tintColor={this.state.color}
                  values={this.ethinicities}
                  selectedIndex={this.state.ethnicity}
                  onTabPress={index => {
                    this.setState({
                      ethnicity: index,
                      edit: true
                    });
                  }}
                />
              </View>

              <SectionHeadingComponent
                title={`Height: ${this.state.height ? this.state.height : 0}cm`}
                style={{ paddingBottom: 10 }}
              />

              <View style={{ paddingLeft: 20 }}>
                <Slider
                  width={width - 40}
                  value={this.state.height}
                  maximumValue={300}
                  onValueChange={height => {
                    this.setState({
                      height: Math.round(height),
                      edit: true
                    });
                  }}
                />
              </View>

              <SectionHeadingComponent
                title={`Weight: ${this.state.weight ? this.state.weight : 0}kg`}
                style={{ paddingBottom: 10 }}
              />

              <View style={{ paddingLeft: 20 }}>
                <Slider
                  width={width - 40}
                  value={this.state.weight}
                  maximumValue={300}
                  onValueChange={weight => {
                    this.setState({
                      weight: Math.round(weight),
                      edit: true
                    });
                  }}
                />
              </View>

              <SectionHeadingComponent
                title="Color"
                style={{ paddingBottom: 10 }}
              />

              <View
                style={{
                  flex: 1,
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  alignContent: "center"
                }}
              >
                <ColorComponent
                  color={COLORS.ACCENT.v0}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v1}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v2}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v3}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v4}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v5}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v6}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v7}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v8}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
                <ColorComponent
                  color={COLORS.ACCENT.v9}
                  selected={this.state.color}
                  selectCallback={color => this.setState({ color, edit: true })}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account,
  contacts: state.contacts,
  channels: state.channels,
  events: state.events
});

const mapDispatchToProps = dispatch => ({
  updateError: text => {
    dispatch(error(text));
  },

  updateMenu: open => {
    dispatch(menu(open));
  },

  updateLoading: busy => {
    dispatch(loading(busy));
  },

  dehydrations: _id => {
    dispatch(dehydrations(_id));
  },

  updateContact: (topic, partialContact) => {
    MQTT.dispatch(topic, updateContact(partialContact));
  },

  updateAccount: data => {
    dispatch(account(data));
  }
});

export const ProfileScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileScreenRC);
