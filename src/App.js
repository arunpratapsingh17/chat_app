import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Mainbody from './components/Mainbody';
import { withAuthenticator } from '@aws-amplify/ui-react'

function App() {
  return (
    <div className="Home_body">
      <Header />
      <Mainbody />
    </div>
  );
}

export default withAuthenticator(App);
