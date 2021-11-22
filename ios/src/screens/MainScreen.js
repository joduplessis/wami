import React from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Platform,
  Linking,
  Image,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import {
  HeroComponent,
  SliderComponent,
  HeadingComponent,
  SubheadingComponent,
  BlockComponent,
  IconComponent
} from "../components";
import { SearchModal } from "../modals";
import { loading, menu, error, tags } from "../actions";
import { GQL, COLORS } from "../helpers";
import Swiper from "react-native-swiper";

const categoryImages = [
  require("../../assets/images/main/Pre.png"),
  require("../../assets/images/main/Kids.png"),
  require("../../assets/images/main/Type1.png"),
  require("../../assets/images/main/Type2.png")
];

class MainScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search_modal: false,
      tags: []
    };

    this.navigateToTag = this.navigateToTag.bind(this);
    this.searchCallback = this.searchCallback.bind(this);
    this.fetchScreenData = this.fetchScreenData.bind(this);
  }

  componentDidMount() {
    this.fetchScreenData();

    setTimeout(() => {
      // this.navigateToTag("5c4703f28d0e84258065d28d");
      // this.setState({ search_modal: true })
      // this.searchCallback("5c4703f28d0e84258065d28d", "");
    }, 1000);
  }

  async fetchScreenData() {
    this.props.updateLoading(true);

    try {
      let tags = await GQL.fetchTags(this.props.common.token);

      this.props.updateLoading(false);
      this.props.updateTags(tags);
    } catch (err) {
      this.props.updateLoading(false);
      this.props.updateError(err);
    }
  }

  navigateToTag(tag) {
    this.props.navigation.navigate("Tag", {
      tag
    });
  }

  searchCallback(tag, term) {
    this.setState({ search_modal: false });
    this.props.updateLoading(true);

    const { token } = this.props.common;

    GQL.fetchCoachSearch(tag, term, token)
      .then(res => res.json())
      .then(res => {
        const { coachSearch } = res.data;

        this.props.updateLoading(false);
        this.props.navigation.navigate("Search", {
          users: coachSearch,
          tag
        });
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  render() {
    const sliderHeight = 350;
    const { width } = Dimensions.get("screen");
    const isAndroid = Platform.OS == 'android';
    const isIOS = Platform.OS == 'ios';

    if (!this.props.common.tags) return null;

    return (
      <View
        style={{
          backgroundColor: "white",
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignContent: "flex-start"
        }}
      >
        <SearchModal
          visible={this.state.search_modal}
          searchCallback={this.searchCallback}
          closeCallback={() => this.setState({ search_modal: false })}
        />

        <ScrollView
          style={{ backgroundColor: "white", zIndex: 4, width }}
          contentContainerStyle={{ width, paddingBottom: 50 }}
        >
          <Image
            style={{
              zIndex: 0,
              width,
              height: 300,
              position: "relative",
              top: -100,
              right: 0,
              marginBottom: -50,
              marginTop: -50
            }}
            source={require("../../assets/images/headers/03.png")}
            resizeMode="contain"
          />

          <View
            style={{
              padding: 20,
              marginBottom: 0,
              marginTop: -50,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                alignContent: "flex-start"
              }}
            >
              <HeadingComponent text="Hello & welcome" color={COLORS.DARK.v6} />

              <HeadingComponent
                text="Get help from an expert with managing things"
                color={COLORS.DARK.v4}
                numberOfLines={2}
                size={20}
              />
            </View>

            <IconComponent
              name="search"
              action={() => this.setState({ search_modal: true })}
              size={32}
              style={{ position: "relative", top: 3, marginLeft: 20 }}
              color={COLORS.DARK.v6}
            />
          </View>

          <SubheadingComponent
            title="Get started on your journey"
            color={COLORS.DARK.v6}
            style={{ padding: 20, paddingTop: 0 }}
          />

          <SliderComponent>
            <BlockComponent
              icon="circle"
              title="Find an expert now"
              color="#E26D5C"
              subtitle="Get 1 week free trial"
              action={() => this.setState({ search_modal: true })}
            />

            <BlockComponent
              title="Have any questions?"
              color="#723D45"
              subtitle="Contact us directly"
              onPress={() => Linking.openURL("https://wami.app/contact")}
            />

            <BlockComponent
              title="Report suspicious activity"
              color="#472D30"
              subtitle="Help make our platform great"
              onPress={() => Linking.openURL("https://wami.app/report")}
            />
          </SliderComponent>

          <SubheadingComponent
            title="Find the right kind of support"
            color={COLORS.DARK.v6}
            style={{ padding: 20, paddingTop: 30 }}
          />

          <SliderComponent>
            {this.props.common.tags.map((tag, index) => {
              const colors = [
                COLORS.ACCENT.v0,
                COLORS.ACCENT.v1,
                COLORS.ACCENT.v2,
                COLORS.ACCENT.v3,
                COLORS.ACCENT.v4,
                COLORS.ACCENT.v5,
                COLORS.ACCENT.v6,
                COLORS.ACCENT.v7,
              ]

              return (
                <BlockComponent
                  key={index}
                  icon={null}
                  title={tag.name}
                  subtitle={tag.description}
                  color={colors[index]}
                  action={() => this.searchCallback(tag._id, "")}
                />
              );
            })}
          </SliderComponent>


          <TouchableOpacity onPress={() => Linking.openURL("https://wami.app")}>
            <SubheadingComponent
              title="Want to become a Wami coach?"
              color={COLORS.DARK.v6}
              style={{ padding: 20, paddingBottom: 5 }}
            />

            <HeadingComponent
              text="You can join our team of coaches by following our easy guide. "
              color={COLORS.DARK.v4}
              numberOfLines={2}
              size={16}
              style={{ paddingLeft: 20 }}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  common: state.common,
  account: state.account
});

const mapDispatchToProps = dispatch => ({
  updateError: payload => {
    dispatch(error(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  },

  updateTags: payload => {
    dispatch(tags(payload));
  },

  updateMenu: payload => {
    dispatch(menu(payload));
  }
});

export const MainScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainScreenRC);
