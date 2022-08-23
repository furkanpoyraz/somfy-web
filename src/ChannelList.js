import React, { useState, useEffect } from 'react';

function ChannelList() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState([]);
  const [channelsTotal, setChannelsTotal] = useState(5);

  const actions = ['UP', 'MY', 'DOWN'];

  const apiUrl = (process.env.NODE_ENV !== 'production') ? "http://localhost:5000" : "/api";

  const fetchChannels = () => {
    fetch(apiUrl + "/channels", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    })
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setChannels(result.channels)
          setChannelsTotal(result.channelsTotal)
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

  const addChannel = () => {
    fetch(apiUrl + "/channels", {
      method: "PUT",
      headers: { "Content-type": "application/json" },
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

  const removeChannel = (channelID) => {
    return () => {
      fetch(apiUrl + "/channels", {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ channelID: channelID })
      })
        .then(res => res.json())
        .then(
          (result) => {
            const updatedChannels = channels.filter((channel) => { return channel.id !== channelID });
            setChannels(updatedChannels);
            localStorage.setItem('channelData', JSON.stringify({ channelsTotal: channels, channels: channelsTotal }));
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
            <button type="button" className="channel-removeBtn" onClick={removeChannel(channel.id)}>&times;</button>
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
        <li className="channel-item channel-item--add">
          <button type="button" className="addChannel" onClick={addChannel}>+ Add Channel</button>
        </li>
        }
      </ul>
    );
  } else {
    return (<span className="loader"></span>)
  }
}

export default ChannelList;