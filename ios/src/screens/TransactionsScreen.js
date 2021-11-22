import React from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Text
} from "react-native";
import { connect } from "react-redux";
import {
  SectionHeadingComponent,
  TransactionComponent,
  LabelComponent,
  SubheadingComponent
} from "../components";
import Icon from "react-native-vector-icons/Feather";
import { loading, menu, error } from "../actions";
import { COLORS, GQL } from "../helpers";

class TransactionsScreenRC extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: []
    };

    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.navigation.goBack();
  }

  componentDidMount() {
    this.fetchScreen();
  }

  fetchScreen() {
    this.props.updateLoading(true);

    GQL.fetchUserTransactions(this.props.account._id, this.props.common.token)
      .then(result => result.json())
      .then(result => {
        const { userTransactions } = result.data;

        this.setState({
          transactions: userTransactions
        });

        this.props.updateLoading(false);
      })
      .catch(err => {
        this.props.updateLoading(false);
        this.props.updateError(err);
      });
  }

  render() {
    const { height, width } = Dimensions.get("screen");

    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            width,
            backgroundColor: this.props.account.color,
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            alignContent: "flex-start"
          }}
        >
          <View
            style={{
              zIndex: 3,
              paddingBottom: 20,
              paddingTop: 40,
              width: width,
              paddingLeft: 20,
              paddingRight: 20,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <TouchableOpacity onPress={this.goBack}>
              <Icon name="arrow-left" size={26} color="white" />
            </TouchableOpacity>

            <Text
              style={{
                paddingLeft: 10,
                fontSize: 18,
                color: "white",
                fontWeight: "800"
              }}
            >
              TRANSACTIONS
            </Text>

            <View style={{ flex: 1 }} />
          </View>
        </View>

        <ScrollView
          style={{
            backgroundColor: "white",
            flex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }}
          contentContainerStyle={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 30,
            width,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            alignContent: "center"
          }}
        >
          <SectionHeadingComponent
            title="Ordered by Date"
            style={{ padding: 20, paddingBottom: 20, paddingTop: 20 }}
          />

          {this.state.transactions.map((transaction, index) => {
            return (
              <TransactionComponent
                key={index}
                title={transaction.title}
                description={transaction.description}
                created={transaction.createdAt}
                amount={transaction.amount}
                action={() => console.log("Transaction click")}
              />
            );
          })}

          {this.state.transactions.length == 0 && (
            <SubheadingComponent
              title="NO TRANSACTIONS"
              style={{ paddingLeft: 20 }}
            />
          )}
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

  updateMenu: payload => {
    dispatch(menu(payload));
  },

  updateLoading: payload => {
    dispatch(loading(payload));
  }
});

export const TransactionsScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionsScreenRC);
