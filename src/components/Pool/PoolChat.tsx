import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { db } from '@/app/firebase/firebase';
import { doc, collection, onSnapshot, addDoc, serverTimestamp, limit, orderBy, query, QueryDocumentSnapshot, getDocs, updateDoc, arrayUnion, FieldValue } from 'firebase/firestore'; // Import QueryDocumentSnapshot
import { UserAuth } from '@/app/firebase/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import moment from 'moment';
import { toast } from 'sonner';
import TimeSince from './TimeSince';

const PoolChat = (props: any) => {
  const chatMessage = useRef<HTMLInputElement>(null);
  const chatContainer = useRef<HTMLDivElement>(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [disableSend, setDisableSend] = useState(false); // State to disable send button
  const [messages, setMessages] = useState([]);
  const { user } = UserAuth();
  const poolId = '1ac33bea-d659-45cc-9b3c-3358bbadbf4e';
  const [limitValue, setLimitValue] = useState(4); // State to track message limit

  // Memoize the fetched messages
  const memoizedMessages = useMemo(() => messages, [messages]);

  // Function to fetch messages from Firestore
  useEffect(() => {
    if (!user) return;

    const chat_id = props.chat_id
    const pool_id = props.pool_id


    const chat_logic = async () => {
      const chatDoc = doc(db, 'pools', pool_id, 'chat', chat_id);
    
      const unsubscribe = onSnapshot(chatDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log('Data:', data);
    
          // Sort messages by createdAt field in descending order
          const sortedMessages = data.messages.sort((a, b) => b.createdAt - a.createdAt);
    
    
          setMessages(sortedMessages);
          setClientLoading(false);
        } else {
          console.log('Document does not exist');
        }
      });
    
      return () => unsubscribe();
    };

    chat_logic()



  }, [user, limitValue]); // Include limitValue as a dependency

  useEffect(() => {
    const scrollChatToBottom = () => {
      if (chatContainer.current) {
        chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
      }
    };
    scrollChatToBottom();
  }, [memoizedMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    setDisableSend(true); // Disable send button

    const message = chatMessage.current.value;

    if (!message) {
      setDisableSend(false); // Enable send button
      return toast.error('Message cannot be empty');
    }

    chatMessage.current.value = '';

    const chat_id = props.chat_id
    const pool_id = props.pool_id

    const chatDoc = doc(db, 'pools', pool_id, 'chat', chat_id);

    const getServerTime = await fetch('https://d66545a3-447c-419f-8ae8-c8d5cf427615-00-qc988hrk28sr.kirk.replit.dev/api/getservertime')

    const serverTime = await getServerTime.json()


    const messageData = {
      text: message,
      username: user.displayName,
      userId: user.uid,
      createdAt: serverTime.serverTime
    };

    await updateDoc(chatDoc, {
      messages: arrayUnion(messageData)
    });

    chatMessage.current.value = '';

    setDisableSend(false); // Enable send button
  };


  
  const loadMoreMessages = () => {
    setLimitValue(prevLimit => prevLimit + 4); // Increase limit by 4
  };

  if (clientLoading) return <div>Loading...</div>;

  return (
    <Card x-chunk="dashboard-05-chunk-3">
      <CardHeader className="px-7">
        <CardTitle>Pool Chat</CardTitle>
        <CardDescription>
          Chat with your friends and family in the pool.
        </CardDescription>
      </CardHeader>
      <CardContent>

        {memoizedMessages.length === 0 && (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500">No messages yet..</p>
          </div>
        )}
        <div ref={chatContainer} className="overflow-y-auto max-h-[300px] flex flex-col relative w-full scroll-smooth">
          {
            memoizedMessages.length > 0 && memoizedMessages.length % 4 === 0 && (
              <div className="py-3">
                <Button onClick={loadMoreMessages} size='sm' variant='outline'>Load more messages</Button>
              </div>
            )
          }

          {memoizedMessages.slice().map(message => (
            <div key={message.id} className="mb-2 flex flex-row gap-2 bg-muted/40 rounded-lg p-3">
              <div>
                <Avatar className='w-12 h-12'>
                  <AvatarImage src="https://firebasestorage.googleapis.com/v0/b/storeapp-47c29.appspot.com/o/pool_images%2F77c1a876-27f4-4610-bdf1-e19f8ab4dc0d?alt=media&token=0c01b4d3-46fc-40ed-bcbf-f165117f2907"/>
                  <AvatarFallback>{message.username.slice(0,1)}{message.username.slice(1,2)}</AvatarFallback>
                </Avatar>
              </div>
              <div className='flex flex-col'>
                <div className='flex gap-2 items-center'>
                  <span className='font-bold text-base'>{message.username}</span>
                  <TimeSince time={message.createdAt} />
                </div>
                <div className='break-all'>
                  <p style={{ wordBreak: 'break-word' }} className='leading-relaxed tracking-tight text-base'>{message.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className='bg-muted/50 px-7 py-5 rounded-b-md'>
        <form className="flex w-full items-center gap-2" onSubmit={(e) => sendMessage(e)}>
          <Input type="text" placeholder="Type your message" ref={chatMessage} />
          <Button type="submit" onClick={(e) => sendMessage(e)} className='h-full' disabled={disableSend}>Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default PoolChat;
