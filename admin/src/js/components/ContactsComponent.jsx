import React from "react";
import { connect } from "react-redux";
import { AvatarComponent, ButtonComponent } from "./";
import { FiCheck } from "react-icons/fi";

class Contacts extends React.Component {
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
                            <th>Timezone</th>
                            <th>DOB</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.props.contacts.map((contact, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        <AvatarComponent
                                            width={25}
                                            height={25}
                                            borderWidth={2}
                                            borderColor="#0facf3"
                                            src={contact.image}
                                        />
                                    </td>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.contact}</td>
                                    <td>{contact.timezone}</td>
                                    <td>{contact.dob}</td>
                                    <td>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                alignContent: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <ButtonComponent
                                                text="Create Appointment"
                                                style={{ width: 200 }}
                                            />
                                        </div>
                                    </td>
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
    contacts: state.contacts,
});

const mapDispatchToProps = (dispatch) => ({});

export const ContactsComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts);
