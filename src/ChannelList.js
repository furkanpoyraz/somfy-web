import React, { useState } from 'react';

function ChannelList() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const channels = 5;
  const actions = ['UP', 'MY', 'DOWN'];

  const updateShutters = (channel, action) => {
    return () => {
      alert('test ' + channel + ' / ' + action);
      fetch("http://localhost:5000/updateShutters", {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ channel: channel, action: action })
      })
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            console.log(result);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }
  }

  return (
    <ul className="channel-list">
      {[...Array(channels).keys()].map((i) =>
        <li className="channel-item" key={i.toString()}>
          <div className="channel-label">Channel {i+1}</div>
          <div className="channelAction-list">
            {actions.map((action) =>
              <button key={action} type="button" className="channelAction-item" onClick={updateShutters(i+1, action)}>{action}</button>
            )}
          </div>
        </li>
      )}
    </ul>
  );
}

export default ChannelList;