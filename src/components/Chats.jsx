import { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { ChatEngine } from 'react-chat-engine'

import { auth } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const Chats = () => {
  const [isLoading, setIsLoading] = useState(true)
  const isMounted = useRef(false)

  const history = useHistory()

  const { user } = useAuth()

  useEffect(() => {
    (async () => {
      if (!isMounted.current) {
        isMounted.current = true

        if (!user) {
          history.push('/')

          return
        }

        try {
          await axios.get('https://api.chatengine.io/users/me', {
            headers: {
              'project-id': process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,
              'user-name': user.email,
              'user-secret': user.uid
            }
          })
    
          setIsLoading(false)  
        }
        catch (err) {
          let formData = new FormData()

          formData.append('email', user.email)
          formData.append('username', user.email)
          formData.append('secret', user.uid)

          const avatar = await getFile(user.photoURL)

          formData.append('avatar', avatar, avatar.name)

          try {
            await axios.post('https://api.chatengine.io/users/', formData, {
              headers: {
                'private-key': process.env.REACT_APP_CHAT_ENGINE_PRIVATE_KEY
              }
            })
            
            setIsLoading(false)
          }
          catch (err) {
            console.log(err)
          }
        }
      }
    })()
  }, [user, history])

  const handleLogout = async () => {
    await auth.signOut()

    history.push('/')
  }

  const getFile = async url => {
    const response = await fetch(url)
    const data = await response.blob()

    return new File([data], 'userPhoto.jpg', { type: 'image/jpg' })
  }

  if (!user || isLoading) return 'Loading...'

  return (
    <div className='chats-page'>
      <div className='nav-bar'>
        <div className='logo-tab'>
          Unichat
        </div>
        <div className='logout-tab' onClick={handleLogout}>
          Logout
        </div>
      </div>
      <ChatEngine
        height='calc(100vh - 66px'
        projectID={process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID}
        userName={user.email}
        userSecret={user.uid}
      />
    </div>
  )
}

export default Chats