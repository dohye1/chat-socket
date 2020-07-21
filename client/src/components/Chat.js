import React, { useState, useEffect } from 'react';
import socketio from 'socket.io-client';
import "./Chat.css";

const socket = socketio.connect('http://localhost:5000');

const Chat = () => {
    const [MySocketId, setMySocketId] = useState('');
    const [Name, setName] = useState('');
    const [IsNameSended, setIsNameSended] = useState(false);
    const [Chat, setChat] = useState('');
    const [IsChatSended, setIsChatSended] = useState(false);
    const [Other, setOther] = useState('');
    const [Msg, setMsg] = useState([]);

    const sendName = (e) => {
        e.preventDefault();
        setIsNameSended(true);
        socket.emit('init', { name: Name });
    }

    useEffect(() => {
        console.log(MySocketId)
        console.log(Msg);
        if (Msg.length > 0) {
            setIsChatSended(true);
        }
    }, [MySocketId, Msg])

    const sendChat = (e) => {
        e.preventDefault();
        socket.emit('sendChat', Chat);
        e.target.firstChild.value = '';
    }

    socket.on('enter', (other) => setOther(other));
    socket.on('welcome', (data) => {
        setMySocketId(data.socketId);
    })

    socket.on('receiveMsg', ({ data, socketId }) => {
        console.log(`${socketId}가 메시지보냄`)
        setMsg([...Msg, { socketId, data }])
    })

    return (
        <div className="chat-container">
            {IsNameSended
                ?
                <div className="name-container">
                    <h3>Hello {Name}</h3>
                    {Other === ''
                        ?
                        <p>아직 상대방이 들어오지 않았음</p>
                        : <div>
                            상대방 : {Other}

                            <form onSubmit={sendChat} className="sendName">
                                <input type="text" onChange={e => setChat(e.currentTarget.value)} />
                            </form>
                        </div>}
                    {
                        IsChatSended ?
                            <div className="chat-box">
                                {Msg.length > 0 && Msg.map((item, index) =>
                                    item.socketId === MySocketId ?
                                        <div className="myChat">
                                            <p>Me</p>
                                            <h6 key={index}>{item.data}</h6>
                                        </div>
                                        :
                                        <div className="otherChat">
                                            <p>{Other}</p>
                                            <h6 key={index}>{item.data}</h6>
                                        </div>
                                )}
                            </div>
                            :
                            <></>
                    }
                </div>
                :
                <form onSubmit={sendName} className="sendName-form">
                    <label>Nickname</label>
                    <input type="text" onChange={e => setName(e.currentTarget.value)} />
                </form>
            }
        </div >
    )
}

export default Chat;