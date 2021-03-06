import React, { useEffect, useState } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

import chatService from 'services/chat-service';
import userService from 'services/user-service';
import Header from 'components/Header';
import withAuth from 'components/withAuth';
import { Redirect, Link } from 'react-router-dom';

const ListChats = (props) => {
  // fetch a chatService.getChatsByUser, pintar la lista que devuelva
  const [chats, setChats] = useState([]);
  const [list, setList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [redirectToChat, setRedirectToChat] = useState(false);
  const [idChat, setIdChat] = useState('');
  const [userChats, setUserChats] = useState([]);
  const [otherUser, setOtherUser] = useState();

  useEffect(() => {
    console.log('props');
    console.log(props)
    getUserChatsAction();
   
  }, []);

  const createNewChat = (otherId) => {
    //coger mi id desde las props y el otherId es del usuario que pincho en la lista para crear un nuevo chat.
    const { _id: myId } = props.user;
    console.log(myId)
    console.log(otherId)
    chatService.createChat(otherId).then(({ data }) => {
      console.log('ha creado el chat')
      console.log(data)
      setIdChat(data._id);
      setRedirectToChat(true);
    })
  }

  const showUsersList = async () => {
    const { user } = props;

    if (user.type === 'alumn') {
      await userService.getTeachersList().then(data => {
        console.log(data.teachers)
        list.push(data.teachers);
        setList(...list);
        console.log(list)
        setShowList(true);
      })
    }

    else {
      await userService.getAlumnsList().then(data => {
        setList(data.alumns);
        setShowList(true);
      })
    }


  }

  const getUserChatsAction = async () => {
    const user = props.user;

    userService.getUserChats(user._id).then(chats => {
      setUserChats(chats);
    });
     

  }


  const getOtherUserAction = (id) => {  // POR SI NO SE PUEDE USAR FILTER EN EL RENDER COGER EL OTRO ID DEL OTRO USUARIO QUE NO SOY YO
    
      chatService.getOtherUser(id).then((data) => {
        setOtherUser(data.username)
      })

  }

  const goBack = () => {
      setShowList(false);
  }

  return (
    <div>
      <Header />
      {!showList ? (
        <>
        {console.log(props.user)}
          { props.user.chats && props.user.chats.length > 0 && userChats.length > 0 ? (
            <div className="subheaderSpace">
              <h2>Chats recientes</h2>
              <ListGroup  style={{ fontSize: '25px' }}>
                { userChats.map(chat => {
                  console.log('chat')
                  console.log(chat)
                        const otherUserFilteredId = chat.users.filter((e) => e._id !== props.user._id)
                    
                        return <Link to={`/chat/${chat._id}`}>
                          <ListGroupItem tag="a" style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}>{otherUserFilteredId}</ListGroupItem>
                        </Link>
                      })
                }
      
              </ListGroup>
              <button onClick={showUsersList} style={{float: 'right'}}>
                  Crea uno
              </button>
            </div>
          ) : (
              <>
                <h1 className="subheaderSpace">No tienes ningún chat</h1>
                <button onClick={showUsersList}>
                  Crea uno
              </button>
              </>
            )
          }
        </>

      ) : (
        <div className={'subheaderSpace'}>
            <h2>Usuarios</h2>
            <ListGroup style={{ fontSize: '25px' }}>
              {list && list.length > 0 &&
                list.map(l => {
                  return <ListGroupItem tag="a" onClick={() => createNewChat(l._id)} style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}>{l.firstName} {l.lastName}</ListGroupItem>
                })
              }

            </ListGroup>
            <button onClick={goBack} style={{float: 'right'}}>
                Atrás
            </button>
          </div>
        )

      }
      {redirectToChat &&
        <Redirect to={'/chat/' + idChat} />
      }

    </div>
  )
}

export default withAuth(ListChats);