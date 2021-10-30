import { createContext, useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { auth } from '../firebase'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  const history = useHistory()

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      setUser(user?.multiFactor?.user)
      setIsLoading(false)
      if (user?.multiFactor?.user) {
        console.log(user?.multiFactor?.user)
        history.push('/chats')
      }
    })
  }, [user, history])

  return (
    <AuthContext.Provider value={{ user }}>
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => useContext(AuthContext)