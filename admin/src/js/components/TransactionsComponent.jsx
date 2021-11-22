import React from "react";
import { connect } from "react-redux";
import { AvatarComponent } from "./";

class Transactions extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                style={{
                    display: "flex",
                    flex: 1,
                    overflow: "scroll",
                    backgroundColor: "white",
                }}
            >
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Amount (USD)</th>
                            <th>Description</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.props.transactions.map((transaction, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <AvatarComponent
                                            width={25}
                                            height={25}
                                            borderWidth={2}
                                            borderColor="#0facf3"
                                            src={transaction.image}
                                        />
                                    </td>
                                    <td>{transaction.name}</td>
                                    <td>{transaction.email}</td>
                                    <td>{transaction.contact}</td>
                                    <td>{transaction.amount}</td>
                                    <td>{transaction.description}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    transactions: state.transactions,
});

const mapDispatchToProps = (dispatch) => ({});

export const TransactionsComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Transactions);
