function ChannelItem(props) {
    const actions = ['UP', 'MY', 'DOWN'];
    const channelsTotal = 5;
    const remainingChannels = [...Array(channelsTotal).keys()].filter((i) => {
      return !props.channels.find(channel => channel.id === i+1)
    });

    const setShutters = (channel, action) => {
      return () => {
        fetch(process.env.REACT_APP_API_URL + "/shutters", {
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
              console.error(error);
            }
          )
      }
    }

    const addChannel = (event) => {
      event.preventDefault();
      const channelData = { id: parseInt(event.target.channel.value), name: event.target.name.value };
  
      fetch(process.env.REACT_APP_API_URL + "/channels", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(channelData)
      })
        .then(res => res.json())
        .then(
          (result) => {
            console.log(result);
            const updatedChannels = props.channels;
            updatedChannels.push(channelData);
            updatedChannels.sort((a,b) => a.id - b.id);
            props.setChannels(updatedChannels)
            props.setAddForm(false);
          },
          (error) => {
            console.error(error);
          }
        )
    }

    const removeChannel = (id) => {
      return () => {
        fetch(process.env.REACT_APP_API_URL + "/channels", {
          method: "DELETE",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ id: id })
        })
          .then(res => res.json())
          .then(
            (result) => {
              const updatedChannels = props.channels.filter((channel) => { return channel.id !== id });
              props.setChannels(updatedChannels);
              console.log(result);
            },
            (error) => {
              console.error(error);
            }
          )
      }
    }

    if (props.type !== "add") {
      return (
        <li className="channel-item">
          <div className="channel-itemOptions">
            <button type="button" className="channel-btn" onClick={removeChannel(props.channel.id)}>&times;</button>
          </div>
          <div className="channel-label">
            {props.channel.name}
            <span className="channel-labelID">Channel {props.channel.id}</span>
          </div>
          <div className="channelAction-list">
            {actions.map((action) =>
              <button key={action} type="button" className="channelAction-item" onClick={setShutters(props.channel.id, action)}>{action}</button>
            )}
          </div>
        </li>
      )
    } else if (props.channels.length !== channelsTotal) {
      return (
        <li className="channel-item channel-item--add">
          {props.addForm &&
            <>
            <form onSubmit={addChannel}>
              <div className="channel-itemOptions">
                <button type="button" className="channel-btn" onClick={() => props.setAddForm(false)}>&times;</button>
                <button type="submit" className="channel-btn channel-btn--add"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg></button>
              </div>
              <div className="channel-label">
                <input type="text" name="name" defaultValue="Channel Name" autoFocus />
                <select className="channel-labelID" name="channel">
                  {remainingChannels.map((i) =>
                    <option key={i} value={i+1}>Channel {i+1}</option>
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
          {!props.addForm && <button type="button" className="addChannel" onClick={() => props.setAddForm(true)}>+ Add Channel</button>}
        </li>
      )
    }
}

export default ChannelItem;