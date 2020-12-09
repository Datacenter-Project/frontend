import logo from './logo.svg';
import './App.css';
import NavBar from './navbar.js';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <NavBar />
   </SnackbarProvider>
  );
}

export default App;
