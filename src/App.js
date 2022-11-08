import './App.css';
import MyNavBar from './components/MyNavBar';
import MySideBar from './components/MySideBar';
import {Container, Row} from "react-bootstrap";
import AnimeGrid from "./components/AnimeGrid";
import {useState} from "react";
import AddAnimeRecordModal from "./components/AddAnimeRecordModal";

function App() {
  const [chosenSideBarItem, setChosenSideBarItem] = useState(0);
  const [addAnimeModelShow, setAddAnimeModelShow] = useState(false);

  return (
    <div className="app-container">
      <MyNavBar/>
      <Container fluid className="main-container p-0">
        <Row className="flex-xl-nowrap h-100">
          <MySideBar chosen={chosenSideBarItem} choose={setChosenSideBarItem} showAddAnimeModel={setAddAnimeModelShow}/>
          <AnimeGrid rating={chosenSideBarItem}/>
        </Row>
      </Container>
      <AddAnimeRecordModal
        show={addAnimeModelShow}
        onHide={() => setAddAnimeModelShow(false)}/>
    </div>
  );
}

export default App;
