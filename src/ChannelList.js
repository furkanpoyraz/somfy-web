import React, { useState, useEffect } from 'react';
import ChannelItem from './ChannelItem';

function ChannelList() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState([]);
  const [addForm, setAddForm] = useState(false);

  const fetchChannels = () => {
    fetch(process.env.REACT_APP_API_URL + "/channels", {
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
          console.error(error);
        }
      )
  }

  useEffect(() => {
    fetchChannels()
  }, []);

  if (isLoaded) {
    return (
      <ul className="channel-list">
        {channels.map((channel) =>
          <ChannelItem key={(channel.id)} channel={channel} channels={channels} setChannels={setChannels} setAddForm={setAddForm} />
        )}
        <ChannelItem type="add" channels={channels} setChannels={setChannels} addForm={addForm} setAddForm={setAddForm} />
      </ul>
    );
  } else {
    return (<span className="loader"></span>)
  }
}

export default ChannelList;