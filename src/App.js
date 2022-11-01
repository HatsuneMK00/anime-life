import './App.css';
import MyNavBar from './components/MyNavBar';
import MySideBar from './components/MySideBar';
import {Container} from "react-bootstrap";

function App() {
  return (
    <div className="app-container">
      <MyNavBar/>
        <Container fluid className="main-container p-0">
          <MySideBar/>
        </Container>
    </div>
  );
}

export default App;
