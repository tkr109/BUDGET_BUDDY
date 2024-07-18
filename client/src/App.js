import './App.css';
import {Routes,Route, Navigate} from 'react-router-dom'
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './components/NotFound';

function App() {
  return (
    <div className='app'> 
      <Routes>
        <Route path='/' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </div>
  );
}

export function ProtectedRoutes(props){
  if(localStorage.getItem('user'))
  {
    return props.children
  }
  else{
    return <Navigate to="/login" />
  }
}

export default App;
