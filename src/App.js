import './App.css';
import MyNavBar from './components/MyNavBar';
import MySideBar from './components/MySideBar';
import {Container, Row} from "react-bootstrap";
import AnimeGrid from "./components/AnimeGrid";
import {useState} from "react";

function App() {
  const [chosenSideBarItem, setChosenSideBarItem] = useState(0);



  return (
    <div className="app-container">
      <MyNavBar/>
        <Container fluid className="main-container p-0">
          <Row className="flex-xl-nowrap h-100">
            <MySideBar chosen={chosenSideBarItem} choose={setChosenSideBarItem}/>
            <AnimeGrid rating={chosenSideBarItem}/>
          </Row>
        </Container>
    </div>
  );
}

export default App;
