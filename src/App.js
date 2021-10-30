import { Switch, Route } from 'react-router-dom'

import Login from './components/Login'
import Chats from './components/Chats'
import './App.css'

const App = () => (
  <div style={{ fontFamily: 'Avenir' }}>
    <Switch>
      <Route exact path='/' component={Login} />
      <Route exact path='/chats' component={Chats} />
    </Switch>
  </div>
)

export default App