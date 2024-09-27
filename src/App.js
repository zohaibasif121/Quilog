import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import Main from './components/Main';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Postform from './components/Postform';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

function App() {


  return (
    <div className="App">
      
      {/* <Navbar/> */}
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/Signup' element={<Signup/>}/>
        <Route path='/Login' element={<Login/>}/>
        <Route path='/Home' element={<PrivateRoute> <Home/> </PrivateRoute>}/>
        <Route path='/Postform' element={<PrivateRoute> <Postform/> </PrivateRoute>}/>
        <Route path='/Profile' element={<PrivateRoute> <Profile/> </PrivateRoute>}/>
        <Route path='/EditProfile' element={<PrivateRoute> <EditProfile/> </PrivateRoute>}/>

      </Routes>
      
    </div>
  );
}

export default App;
