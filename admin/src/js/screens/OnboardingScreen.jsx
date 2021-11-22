import React from "react";
import { connect } from "react-redux";
import {
    Input,
    Select,
    Upload,
    Icon,
    message,
    Steps,
    Tabs,
    Switch,
    Spin,
    Tag,
} from "antd";
import {
    HeadingComponent,
    SectionHeadingComponent,
    GroupComponent,
    PopupComponent,
    ButtonComponent,
    TextButtonComponent,
} from "../components";
import { uiEvent, tags } from "../actions";
import moment from "moment";
import { FiX } from "react-icons/fi";
import * as axios from "axios";
import { currentAuthenticatedUser, API_PATH } from "../helpers";

const Option = Select.Option;
const CheckableTag = Tag.CheckableTag;
const tagsFromServer = [
    "Diabetes",
    "Hypertension",
    "Cancer",
    "Heart disease",
    "Depression",
    "Weight",
    "Weight loss",
    "Stress reduction",
    "Exercise",
    "Better nutrition",
    "General wellness",
];

class Onboarding extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: null,
            error: null,
            success: null,
            key: "0",
            email: "",
            title: "",
            tags: [],
            descriptors: [],
            token: "",
            description: "",
            professional: [],
            banking: [],
            account: "",
            branch: "",
            bank: "",
        };

        this.navigate = this.navigate.bind(this);
        this.complete = this.complete.bind(this);
        this.token = this.token.bind(this);
        this.uploadBankingDocuments = this.uploadBankingDocuments.bind(this);
        this.uploadProfessionalDocuments = this.uploadProfessionalDocuments.bind(
            this
        );
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(tag, checked) {
        const { descriptors } = this.state;
        const nextSelectedTags = checked
            ? [...descriptors, tag]
            : descriptors.filter((t) => t !== tag);

        this.setState({
            descriptors: nextSelectedTags,
        });
    }

    uploadProfessionalDocuments(info) {
        const status = info.file.status;

        if (status !== "uploading") {
            console.log(info.file, info.fileList);

            this.setState({
                loading: true,
            });
        }

        if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);

            this.setState({
                loading: null,
            });
        }

        if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);

            this.setState({
                loading: null,
            });
        }

        this.setState({
            professional: info.fileList.slice(-1),
        });

        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);

            this.setState({
                loading: null,
            });
        }
    }

    uploadBankingDocuments(info) {
        const status = info.file.status;

        if (status !== "uploading") {
            console.log(info.file, info.fileList);

            this.setState({
                loading: true,
            });
        }

        if (status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);

            this.setState({
                loading: null,
            });
        }

        if (status === "error") {
            message.error(`${info.file.name} file upload failed.`);

            this.setState({
                loading: null,
            });
        }

        this.setState({
            banking: info.fileList.slice(-1),
        });

        if (info.file.status === "done") {
            message.success(`${info.file.name} file uploaded successfully.`);

            this.setState({
                loading: null,
            });
        }
    }

    token() {
        this.setState({
            loading: true,
            error: null,
        });

        axios({
            url: `${API_PATH}/user/onboarding/token`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            data: JSON.stringify({
                email: this.state.email,
            }),
        })
            .then((response) => {
                this.navigate("1");

                this.setState({
                    loading: false,
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error:
                        error.response.status == 409
                            ? "User onboarded already, please login"
                            : "Error getting token",
                });
            });
    }

    componentDidMount() {
        this.setState({
            loading: true,
            error: null,
        });

        axios({
            url: `${API_PATH}/graphql`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            data: JSON.stringify({
                query: `
                    query Tags {
                        tags {
                            _id
                            name
                        }
                    }
                `,
            }),
        })
            .then((response) => {
                const { tags } = response.data.data;

                this.props.hydrateTags(tags);

                this.setState({
                    loading: false,
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error: "No network connection",
                });
            });
    }

    complete() {
        this.setState({
            loading: true,
            error: null,
        });

        axios({
            url: `${API_PATH}/user/onboarding/complete`,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            data: JSON.stringify({
                email: this.state.email,
                token: this.state.token,
                description: this.state.description,
                tags: this.state.tags,
                descriptors: this.state.descriptors,
                title: this.state.title,
                bank: this.state.bank,
                branch: this.state.branch,
                account: this.state.account,
            }),
        })
            .then((response) => {
                this.setState({
                    loading: false,
                });

                alert(
                    "Congratulations! You are now a Wami expert. Please log in."
                );

                this.props.history.push("/");
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error:
                        error.response.status == 409
                            ? "User onboarded already, please login"
                            : "Error getting token",
                });
            });
    }

    navigate(key) {
        this.setState({
            key,
        });
    }

    render() {
        const Dragger = Upload.Dragger;

        return (
            <div className="onboarding">
                {this.state.loading && (
                    <div
                        style={{
                            zIndex: 5000,
                            background: "rgba(0, 0, 0, 0.2)",
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Spin size="large" />
                    </div>
                )}

                <div className="container">
                    <div style={{ padding: 40 }}>
                        <div style={{ marginBottom: 20 }}>
                            <img
                                src="./assets/logo.png"
                                height="20"
                                style={{ marginBottom: 10 }}
                            />

                            {this.state.error && (
                                <p className="warning">{this.state.error}</p>
                            )}

                            {this.state.success && (
                                <p className="success">{this.state.success}</p>
                            )}
                        </div>

                        <Steps current={parseInt(this.state.key)}>
                            <Steps.Step title="Setup" />
                            <Steps.Step title="Account" />
                            <Steps.Step title="Professional" />
                            <Steps.Step title="Banking" />
                        </Steps>

                        <Tabs defaultActiveKey="0" activeKey={this.state.key}>
                            <Tabs.TabPane tab="Setup" key="0">
                                <p>
                                    Welcome to Wami! In order for you to be a
                                    certified Wami expert, we need to link your
                                    existing account. Remember, you need to
                                    first sign up on the mobile app - so if you
                                    haven't done that yet, do so now - and then
                                    come back here to continue.
                                </p>

                                <p className="warning">
                                    Note: you will need scanned PDF documents of
                                    your banking account details and
                                    qualifications to complete.
                                </p>

                                <SectionHeadingComponent
                                    title="Email"
                                    align="left"
                                />

                                <Input
                                    size="large"
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={({ target }) =>
                                        this.setState({ email: target.value })
                                    }
                                />

                                <ButtonComponent
                                    action={this.token}
                                    text="Start"
                                    style={{ flex: 1, marginTop: 20 }}
                                />
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Account" key="1">
                                <p>
                                    Great! Excited to have you on board. We've
                                    emailed you a unique code so we can make you
                                    an expert! Simply paste the code we've email
                                    you below. If you haven't received a mail
                                    from us, you can <a href="#">click here</a>{" "}
                                    to resend.
                                </p>

                                <SectionHeadingComponent
                                    title="Token"
                                    align="left"
                                />

                                <Input
                                    size="large"
                                    placeholder="Token"
                                    value={this.state.token}
                                    onChange={({ target }) =>
                                        this.setState({ token: target.value })
                                    }
                                />

                                <div
                                    style={{
                                        marginTop: 20,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ButtonComponent
                                        action={() => this.navigate("0")}
                                        text="Go back"
                                        inverted
                                        style={{
                                            flex: 1,
                                            margin: 5,
                                            marginLeft: 0,
                                        }}
                                    />
                                    <ButtonComponent
                                        action={() => this.navigate("2")}
                                        text="Next"
                                        inverted
                                        style={{
                                            flex: 1,
                                            margin: 5,
                                            marginRight: 0,
                                        }}
                                    />
                                </div>
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Professional" key="2">
                                <p>
                                    Please upload 1 registration document that
                                    shows us you are able to practice within
                                    your chosen field of expertise.
                                </p>

                                <SectionHeadingComponent
                                    title="Title"
                                    align="left"
                                />

                                <GroupComponent>
                                    <Input
                                        size="large"
                                        placeholder="Title"
                                        style={{
                                            marginRight: 5,
                                            marginBottom: 5,
                                        }}
                                        onChange={({ target }) =>
                                            this.setState({
                                                title: target.value,
                                            })
                                        }
                                        value={this.state.title}
                                    />
                                </GroupComponent>

                                <GroupComponent>
                                    <Select
                                        defaultValue={this.state.tags}
                                        size="large"
                                        onChange={(value) =>
                                            this.setState({ tags: value })
                                        }
                                        mode="single"
                                        style={{
                                            width: "100%",
                                            marginBottom: 5,
                                        }}
                                        placeholder="Please select field of expertise"
                                    >
                                        {this.props.tags.map((tag, index) => {
                                            return (
                                                <Select.Option
                                                    key={index}
                                                    value={tag._id}
                                                >
                                                    {tag.name}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </GroupComponent>

                                {/*
                                {tagsFromServer.map(tag => (
                                    <CheckableTag
                                        key={tag}
                                        checked={this.state.descriptors.indexOf(tag) > -1}
                                        onChange={(checked) => {
                                            if (this.state.descriptors.length > 2) {
                                                alert('Max of 3')
                                            } else {
                                                this.handleChange(tag, checked);
                                            }
                                        }}>

                                            {tag}
                                    </CheckableTag>
                                ))}
                                */}

                                <Input.TextArea
                                    size="large"
                                    placeholder="Bio"
                                    style={{ marginTop: 5 }}
                                    value={this.state.description}
                                    onChange={({ target }) =>
                                        this.setState({
                                            description: target.value,
                                        })
                                    }
                                />

                                <div style={{ marginTop: 20 }}>
                                    <Dragger
                                        method="POST"
                                        name="file"
                                        fileList={this.state.professional}
                                        multiple={false}
                                        action={`${API_PATH}/user/${this.state.token}/documents/professional`}
                                        onChange={
                                            this.uploadProfessionalDocuments
                                        }
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">
                                            Click or drag files to this area to
                                            upload
                                        </p>
                                        <p className="ant-upload-hint">
                                            Documents are required to be PDF
                                            format, other formats will be
                                            allowable at our discretion.
                                        </p>
                                    </Dragger>
                                </div>

                                <div
                                    style={{
                                        marginTop: 20,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ButtonComponent
                                        action={() => this.navigate("1")}
                                        text="Go back"
                                        inverted
                                        style={{
                                            flex: 1,
                                            margin: 5,
                                            marginLeft: 0,
                                        }}
                                    />
                                    <ButtonComponent
                                        action={() => this.navigate("3")}
                                        text="Next"
                                        inverted
                                        style={{
                                            flex: 1,
                                            margin: 5,
                                            marginRight: 0,
                                        }}
                                    />
                                </div>
                            </Tabs.TabPane>

                            <Tabs.TabPane tab="Banking" key="3">
                                <p>
                                    Almost done! Please fill out these fields &
                                    attach 1 bank verified document that provide
                                    us with proof that these details are
                                    correct. A statement is acceptable.
                                </p>

                                <GroupComponent>
                                    <Input
                                        size="large"
                                        placeholder="Bank account number"
                                        style={{
                                            marginRight: 5,
                                            marginBottom: 5,
                                        }}
                                        onChange={({ target }) =>
                                            this.setState({
                                                account: target.value,
                                            })
                                        }
                                        value={this.state.account}
                                    />
                                </GroupComponent>

                                <GroupComponent>
                                    <Input
                                        size="large"
                                        placeholder="Bank account branch number"
                                        style={{
                                            marginRight: 5,
                                            marginBottom: 5,
                                        }}
                                        onChange={({ target }) =>
                                            this.setState({
                                                branch: target.value,
                                            })
                                        }
                                        value={this.state.branch}
                                    />
                                </GroupComponent>

                                <GroupComponent>
                                    <Input
                                        size="large"
                                        placeholder="Bank name"
                                        style={{
                                            marginRight: 5,
                                            marginBottom: 5,
                                        }}
                                        onChange={({ target }) =>
                                            this.setState({
                                                bank: target.value,
                                            })
                                        }
                                        value={this.state.bank}
                                    />
                                </GroupComponent>

                                <div style={{ marginTop: 20 }}>
                                    <Dragger
                                        method="POST"
                                        name="file"
                                        fileList={this.state.banking}
                                        multiple={false}
                                        action={`${API_PATH}/user/${this.state.token}/documents/banking`}
                                        onChange={this.uploadBankingDocuments}
                                    >
                                        <p className="ant-upload-drag-icon">
                                            <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">
                                            Click or drag files to this area to
                                            upload
                                        </p>
                                        <p className="ant-upload-hint">
                                            Documents are required to be PDF
                                            format, other formats will be
                                            allowable at our discretion.
                                        </p>
                                    </Dragger>
                                </div>

                                <div
                                    style={{
                                        marginTop: 20,
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <ButtonComponent
                                        action={() => this.navigate("2")}
                                        text="Go back"
                                        inverted
                                        style={{
                                            flex: 1,
                                            margin: 5,
                                            marginLeft: 0,
                                        }}
                                    />
                                    <ButtonComponent
                                        action={() => this.complete()}
                                        text="Finish"
                                        inverted
                                        style={{
                                            flex: 1,
                                            margin: 5,
                                            marginRight: 0,
                                        }}
                                    />
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>

                    <div className="onboarding-footer">
                        By signing up, you are agreeing with our{" "}
                        <a href="#">terms & conditions</a>. To login,{" "}
                        <a href="#">click here</a>.
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    common: state.common,
    calendar: state.calendar,
    contacts: state.contacts,
    tags: state.tags,
});

const mapDispatchToProps = (dispatch) => ({
    uiEvent: (payload) => {
        dispatch(uiEvent(payload));
    },

    hydrateTags: (payload) => {
        dispatch(tags(payload));
    },
});

export const OnboardingScreen = connect(
    mapStateToProps,
    mapDispatchToProps
)(Onboarding);
