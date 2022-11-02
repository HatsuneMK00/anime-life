import './App.css';
import MyNavBar from './components/MyNavBar';
import MySideBar from './components/MySideBar';
import {Container, Row} from "react-bootstrap";
import AnimeGrid from "./components/AnimeGrid";

function App() {
  return (
    <div className="app-container">
      <MyNavBar/>
        <Container fluid className="main-container p-0">
          <Row className="flex-xl-nowrap h-100">
            <MySideBar/>
            <AnimeGrid/>
          </Row>
        </Container>
    </div>
  );
}

export default App;
