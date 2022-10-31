import Dropboxapp from './Dropboxapp'; 
import {Switch,Route} from 'react-router-dom'
import './App.css';

function App() {
  return (
    <div className='App'>
    <Switch>
      <Route path ='/' exact={true}>
      <Dropboxapp/>
      </Route>
      </Switch>
      </div>
  );
}

export default App;
