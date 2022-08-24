import React, { useState, useEffect } from 'react';

function ChannelList() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const actions = ['UP', 'MY', 'DOWN'];
  const channelsTotal = 5;

  const apiUrl = (process.env.NODE_ENV !== 'production') ? "http://localhost:5000" : "/api";

  const remainingChannels = [...Array(channelsTotal).keys()].filter((i) => {
    return !channels.find(channel => channel.id === i+1)
  });

  const fetchChannels = () => {
    fetch(apiUrl + "/channels", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setChannels(result.data)
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }

  const setShutters = (channel, action) => {
    return () => {
      fetch(apiUrl + "/shutters", {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ channel: channel, action: action })
      })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
          },
          (error) => {
            setError(error);
          }
        )
    }
  }

  const submitChannel = (event) => {
    event.preventDefault();
    const formData = { id: parseInt(event.target.channel.value), name: event.target.name.value };

    fetch(apiUrl + "/channels", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
          const updatedChannels = channels;
          updatedChannels.push(formData);
          updatedChannels.sort((a,b) => a.id - b.id);
          setChannels(updatedChannels)
          setShowAddForm(false);
        },
        (error) => {
          setError(error);
        }
      )
  }

  const removeChannel = (id) => {
    return () => {
      fetch(apiUrl + "/channels", {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ id: id })
      })
        .then(res => res.json())
        .then(
          (result) => {
            const updatedChannels = channels.filter((channel) => { return channel.id !== id });
            setChannels(updatedChannels);
            console.log(result);
          },
          (error) => {
            setError(error);
          }
        )
    }
  }

  useEffect(() => {
    fetchChannels()
  }, []);

  if (isLoaded) {
    return (
      <ul className="channel-list">
        {channels.map((channel) =>
          <li className="channel-item" key={channel.id}>
            <div className="channel-itemOptions">
              <button type="button" className="channel-btn" onClick={removeChannel(channel.id)}>&times;</button>
            </div>
            <div className="channel-label">
              {channel.name}
              <span className="channel-labelID">Channel {channel.id}</span>
            </div>
            <div className="channelAction-list">
              {actions.map((action) =>
                <button key={action} type="button" className="channelAction-item" onClick={setShutters(channel.id, action)}>{action}</button>
              )}
            </div>
          </li>
        )}
        {(channels.length !== channelsTotal) &&
        <li className={!showAddForm ? "channel-item channel-item--add" : "channel-item"}>
          {showAddForm &&
            <>
            <form onSubmit={submitChannel}>
              <div className="channel-itemOptions">
                <button type="button" className="channel-btn" onClick={() => setShowAddForm(false)}>&times;</button>
                <button type="submit" className="channel-btn channel-btn--add"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg></button>
              </div>
              <div className="channel-label">
                <input type="text" name="name" defaultValue="Channel Name" autoFocus />
                <select className="channel-labelID" name="channel">
                  {remainingChannels.map((i) =>
                    <option key={i.toString()} value={i+1}>Channel {i+1}</option>
                  )}
                </select>
              </div>
            </form>
            <div className="channelAction-list">
              {actions.map((action) =>
                <button key={action} type="button" className="channelAction-item" disabled>{action}</button>
              )}
            </div>
            </>
          }
          {!showAddForm && <button type="button" className="addChannel" onClick={() => setShowAddForm(true)}>+ Add Channel</button>}
        </li>
        }
      </ul>
    );
  } else {
    return (<span className="loader"></span>)
  }
}

export default ChannelList;