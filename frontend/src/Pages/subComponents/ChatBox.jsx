import React from 'react'
import SingleChat from '../userAvatar/SingleChat'
function ChatBox({fetchAgain,setFetchAgain}) {
  return (
    <div style={{height:'90vh'}}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  )
}

export default ChatBox