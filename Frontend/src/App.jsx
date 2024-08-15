import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
function App() {

  return (
    <>
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<Signup/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
     </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
