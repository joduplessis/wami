import { API_PATH } from "./";

export const GQL = {
  fetchUserAccount: (id, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query FetchUser($id: String!) {
                        user(id: $id) {
                            _id
                            email
                            name
                            image
                            country
                            plan
                            dob
                            color
                            timezone
                        }
                    }
                `,
        variables: {
          id
        }
      })
    });
  },

  fetchTasks: (id, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query FetchTasks($id: String!) {
                        userTasks(id: $id) {
                            _id
                            text
                            description
                            completed
                            createdAt
                            contact {
                                _id
                                name
                                color
                            }
                        }
                    }
                `,
        variables: {
          id
        }
      })
    });
  },

  userTasksFromCoach: (id, cid, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query FetchCoachTasks($id: String!, $cid: String!) {
                        userTasksFromCoach(id: $id, cid: $cid) {
                            _id
                            text
                            description
                            completed
                            createdAt
                            contact {
                                _id
                                name
                                color
                            }
                        }
                    }
                `,
        variables: {
          id,
          cid
        }
      })
    });
  },

  fetchUser: (id, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query FetchUser($id: String!) {
                        userAvailability(id: $id)
                        userRating(id: $id)
                        userTasks(id: $id) {
                            _id
                            text
                            description
                            completed
                            createdAt
                            contact {
                                _id
                                name
                                color
                            }
                        }
                        user(id: $id) {
                            _id
                            email
                            name
                            description
                            title
                            image
                            contact
                            country
                            dob
                            color
                            weight
                            height
                            ethnicity
                            gender
                            card
                            vendor
                            token
                            device
                            rating
                            tags {
                                _id
                                name
                                color
                            }
                            plan
                            timezone
                            calendar {
                                _id
                                timezone
                                address
                                location {
                                    coordinates
                                    type
                                }
                                rate
                            }
                        }
                    }
                `,
        variables: {
          id
        }
      })
    });
  },

  fetchCoachSearch: (tag, term, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query CoachSearch($tag: String!, $term: String!) {
                        coachSearch(tag: $tag, term: $term) {
                            _id
                            email
                            name
                            description
                            title
                            image
                            contact
                            country
                            dob
                            color
                            tags {
                                _id
                                name
                                color
                            }
                        }
                    }
                `,
        variables: {
          tag,
          term
        }
      })
    });
  },

  fetchUserSearch: (term, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query SearchUsers($term: String!) {
                        userSearch(term: $term) {
                            _id
                            email
                            name
                            description
                            title
                            image
                            contact
                            country
                            dob
                            color
                            tags {
                                _id
                                name
                                color
                            }
                        }
                    }
                `,
        variables: {
          term
        }
      })
    });
  },

  fetchUserTransactions: (id, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query Transactions($id: String!) {
                        userTransactions(id: $id, count: 50) {
                            _id
                            title
                            description
                            createdAt
                            amount
                        }
                    }
                `,
        variables: { id }
      })
    });
  },

  fetchChannel: (id, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query FetchChannel($id: String!) {
                        channel(id: $id) {
                            _id
                            name
                            description
                            image
                            private
                            tags {
                                _id
                                name
                                color
                            }
                            user {
                                _id
                                name
                                image
                                color
                            }
                            group {
                                _id
                                image
                                name
                                color
                                members {
                                    _id
                                }
                            }
                            members {
                                _id
                            }
                        }
                    }
                `,
        variables: { id }
      })
    });
  },

  fetchGroup(id, token) {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query Group($id: String!) {
                        group(id: $id) {
                            _id
                            name
                            color
                            image
                            members {
                                _id
                                name
                                image
                                color
                                title
                            }
                        }
                    }
                `,
        variables: { id }
      })
    });
  },

  fetchTag: (tag, count, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query FetchTag($tag: String!, $count: Int!) {
                        tag(id: $tag) {
                            _id
                            name
                            color
                            description
                        }
                        usersForTag(tag: $tag, count: $count) {
                            _id
                            name
                            title
                            image
                            rating
                            color
                            calendar {
                                available
                            }
                        }
                        channelsForTag(tag: $tag, count: $count) {
                            _id
                            name
                            description
                            group {
                                _id
                                name
                                color
                                image
                            }
                            user {
                                _id
                                name
                                color
                                image
                            }
                            image
                            members {
                                _id
                            }
                        }
                    }
                `,
        variables: {
          tag,
          count
        }
      })
    });
  },

  fetchTagUsers: (tag, count, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query FetchTag($tag: String!, $count: Int!) {
                        usersForTag(tag: $tag, count: $count) {
                            _id
                            name
                            title
                            image
                            rating
                            color
                            calendar {
                                available
                            }
                        }
                    }
                `,
        variables: {
          tag,
          count
        }
      })
    });
  },

  fetchTagChannels: (tag, count, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query FetchTag($tag: String!, $count: Int!) {
                        channelsForTag(tag: $tag, count: $count) {
                            _id
                            name
                            description
                            private
                            group {
                                _id
                                name
                                color
                                image
                            }
                            user {
                                _id
                                name
                                color
                                image
                            }
                            image
                            members {
                                _id
                            }
                        }
                    }
                `,
        variables: {
          tag,
          count
        }
      })
    });
  },

  fetchEvent: (id, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query Event($id: String!) {
                        event(id: $id) {
                            _id
                            notes
                            processed
                            rate
                            location {
                                coordinates
                            }
                            address
                            start
                            end
                            offline
                            mandatory
                            owner {
                                _id
                                image
                                color
                                name
                                title
                            }
                            expert {
                                _id
                                name
                                title
                                color
                                image
                            }
                            calendar {
                                _id
                                timezone
                                interval
                            }
                            attendees {
                                status
                                user {
                                    _id
                                    name
                                    image
                                    title
                                    color
                                }
                            }
                        }
                    }
                `,
        variables: { id }
      })
    });
  },

  fetchCalendarsForGeo: (longitude, latitude, token) => {
    return fetch(`${API_PATH}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer: ${token}`
      },
      body: JSON.stringify({
        query: `
                    query Calendars($longitude: Float!, $latitude: Float!) {
                        calendarsGeo(longitude: $longitude, latitude: $latitude) {
                            available
                            location {
                                coordinates
                            }
                            user {
                                _id
                                name
                                description
                                color
                                tags {
                                    name
                                }
                                title
                                image
                                rating
                            }
                        }
                    }
                `,
        variables: {
          longitude,
          latitude
        }
      })
    });
  },

  fetchGroups: async (id, token) => {
    try {
      let response = await fetch(`${API_PATH}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer: ${token}`
        },
        body: JSON.stringify({
          query: `
                        query Groups($id: String!) {
                            groups(id: $id) {
                                _id
                                name
                                color
                                image
                                members {
                                    _id
                                }
                            }
                        }
                    `,
          variables: { id }
        })
      });

      let data = await response.json();

      return data.data.groups;
    } catch (error) {
      throw new Error(error);
    }
  },

  fetchContacts: async (id, token) => {
    try {
      let response = await fetch(`${API_PATH}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer: ${token}`
        },
        body: JSON.stringify({
          query: `
                        query Contacts($id: String!) {
                            contacts(id: $id) {
                                _id
                                conditions
                                consultations
                                goals
                                contact {
                                    _id
                                    name
                                    color
                                    image
                                    title
                                }
                                user {
                                    _id
                                    name
                                    color
                                    image
                                    title
                                }
                                confirmed
                            }
                        }
                    `,
          variables: { id }
        })
      });

      let data = await response.json();

      return data.data.contacts;
    } catch (error) {
      throw new Error(error);
    }
  },

  fetchTags: async token => {
    try {
      let response = await fetch(`${API_PATH}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer: ${token}`
        },
        body: JSON.stringify({
          query: `
                        {
                            tags {
                                _id
                                name
                                description
                                color
                                image
                            }
                        }
                    `
        })
      });

      let data = await response.json();

      return data.data.tags;
    } catch (error) {
      throw new Error(error);
    }
  },

  fetchMessages: async (topic, token) => {
    try {
      let response = await fetch(`${API_PATH}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer: ${token}`
        },
        body: JSON.stringify({
          query: `
                        query Messages($topic: String!) {
                            messages(topic: $topic) {
                                _id
                                text
                                mime
                                url
                                reactions
                                topic
                                createdAt
                                sender {
                                    _id
                                    plan
                                    color
                                    name
                                    title
                                    image
                                }
                            }
                        }
                    `,
          variables: {
            topic
          }
        })
      });

      let data = await response.json();

      return data.data.messages;
    } catch (error) {
      throw new Error(error);
    }
  },

  fetchEvents: async (id, token) => {
    try {
      let response = await fetch(`${API_PATH}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer: ${token}`
        },
        body: JSON.stringify({
          query: `
                        query Events($id: String!) {
                            events(id: $id) {
                                _id
                                notes
                                processed
                                start
                                end
                                owner {
                                    _id
                                    image
                                    color
                                    title
                                    name
                                }
                                expert {
                                    _id
                                    image
                                    color
                                    title
                                    name
                                }
                                attendees {
                                    status
                                    user {
                                        _id
                                        name
                                        image
                                        title
                                    }
                                }
                            }
                        }
                    `,
          variables: { id }
        })
      });

      let data = await response.json();

      return data.data.events;
    } catch (error) {
      throw new Error(error);
    }
  },

  fetchChannels: async (id, token) => {
    try {
      let response = await fetch(`${API_PATH}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer: ${token}`
        },
        body: JSON.stringify({
          query: `
                        query Channels($id: String!) {
                            channels(id: $id) {
                                _id
                                name
                                description
                                private
                                group {
                                    _id
                                    name
                                    color
                                    image
                                }
                                user {
                                    _id
                                    name
                                    color
                                    image
                                }
                                image
                                members {
                                    _id
                                }
                            }
                        }
                    `,
          variables: { id }
        })
      });

      let data = await response.json();

      return data.data.channels;
    } catch (error) {
      throw new Error(error);
    }
  },

  SYSTEM: {
    fetchGroup: async (id, token) => {
      try {
        let response = await fetch(`${API_PATH}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer: ${token}`
          },
          body: JSON.stringify({
            query: `
                            query Group($id: String!) {
                                group(id: $id) {
                                    _id
                                    name
                                    color
                                    image
                                    members {
                                        _id
                                    }
                                }
                            }
                        `,
            variables: { id }
          })
        });

        let data = await response.json();

        return data.data.group;
      } catch (error) {
        throw new Error(error);
      }
    },

    fetchContact: async (id, token) => {
      try {
        let response = await fetch(`${API_PATH}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer: ${token}`
          },
          body: JSON.stringify({
            query: `
                            query Contact($id: String!) {
                                contact(id: $id) {
                                    _id
                                    conditions
                                    consultations
                                    goals
                                    contact {
                                        _id
                                        name
                                        color
                                        image
                                        title
                                    }
                                    user {
                                        _id
                                        name
                                        color
                                        image
                                        title
                                    }
                                    confirmed
                                }
                            }
                        `,
            variables: { id }
          })
        });

        let data = await response.json();

        return data.data.contact;
      } catch (error) {
        throw new Error(error);
      }
    },

    fetchEvent: async (id, token) => {
      try {
        let response = await fetch(`${API_PATH}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer: ${token}`
          },
          body: JSON.stringify({
            query: `
                            query Event($id: String!) {
                                event(id: $id) {
                                    _id
                                    notes
                                    processed
                                    start
                                    end
                                    owner {
                                        _id
                                        image
                                        color
                                        title
                                        name
                                    }
                                    expert {
                                        _id
                                        image
                                        color
                                        title
                                        name
                                    }
                                    attendees {
                                        status
                                        user {
                                            _id
                                            name
                                            image
                                            title
                                        }
                                    }
                                }
                            }
                        `,
            variables: { id }
          })
        });

        let data = await response.json();

        return data.data.event;
      } catch (error) {
        throw new Error(error);
      }
    },

    fetchChannel: async (id, token) => {
      try {
        let response = await fetch(`${API_PATH}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer: ${token}`
          },
          body: JSON.stringify({
            query: `
                            query Channel($id: String!) {
                                channel(id: $id) {
                                    _id
                                    name
                                    private
                                    description
                                    group {
                                        _id
                                        name
                                        color
                                        image
                                    }
                                    user {
                                        _id
                                        name
                                        color
                                        image
                                    }
                                    image
                                    members {
                                        _id
                                    }
                                }
                            }
                        `,
            variables: { id }
          })
        });

        let data = await response.json();

        return data.data.channel;
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
