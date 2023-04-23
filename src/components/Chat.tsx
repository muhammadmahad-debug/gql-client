import React, { useState ,useEffect} from 'react';
import { useSubscription, useMutation  , useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const MESSAGE_SUBSCRIPTION = gql`
  subscription MessageSubscription {
    messageSent {
      id
      content
      sender
    }
  }
`;
const GET_MESSAGE_QUERY = gql`
   query {
    messages {
      id
      sender
      content
      createdat
    }
  }
`
const ADD_MESSAGE_MUTATION = gql`
  mutation SendMessageMutation($content: String!, $sender: String!) {
    sendMessage(content: $content, sender: $sender) {
      id
      content
      sender
    }
  }
`;

interface Message {
  id: string;
  content: string;
  sender: string;
}

interface MessageData {
  messageSent: Message;
}

const Chat: React.FC = () => {
  const [messageListing, setMessageListing] = useState<any>([])
  const [content, setContent] = useState('');
    const [createdBy, setCreatedBy] = useState('');
   const { data:listMessage, loading, error } = useQuery(GET_MESSAGE_QUERY);
  const [addMessage] = useMutation<MessageData>(ADD_MESSAGE_MUTATION);
  const { data } = useSubscription<MessageData>(MESSAGE_SUBSCRIPTION);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addMessage({ variables: { content, sender: createdBy } });
      setContent('');
      setCreatedBy('')
  };

  useEffect(() => {
    // check for errors and render messages if no errors
      if (!error && listMessage) {
        setMessageListing(listMessage.messages)
    }
  }, [listMessage, error]);
    useEffect(() => {
        if (data?.messageSent) {
          setMessageListing((prev:any) => ([  ...prev , {...data?.messageSent}]))
      }
    }, [data])
    
  return (
    <div className="chat-frame">
      <div className="chat-container">
            <div className="chat-messages">
                {messageListing.map((item:any) => (
            <div className="message" key={item.id}>
              <div className="message-content">{item.content}</div>
              <div className="message-created-by">- {item.sender}</div>
            </div>
          )) }
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <div className="chat-wrap">
            <input
              type="text"
              className='name'
              placeholder="Your name"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            />
            <input
              type="text"
              className='message'
              placeholder="Type a message"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit">
              <img src='images/send.svg' alt='send'/>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;