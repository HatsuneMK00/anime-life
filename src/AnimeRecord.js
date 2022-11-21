import MyNavBar from "./components/MyNavBar";
import {Container, Row} from "react-bootstrap";
import MySideBar from "./components/MySideBar";
import AnimeGrid from "./components/AnimeGrid";
import AddAnimeRecordModal from "./components/AddAnimeRecordModal";
import {useEffect, useState} from "react";
import './AnimeRecord.css';
import {BASE_URL_WS} from "./global/network";

const socket = new WebSocket(BASE_URL_WS);

function AnimeRecord() {
  const [chosenSideBarItem, setChosenSideBarItem] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [addAnimeModalShow, setAddAnimeModalShow] = useState(false);

  useEffect(() => {
    socket.onopen = () => {
      console.log('connected');
    };

    socket.onmessage = (e) => {
      console.log(e.data);
    };

    return () => {
      console.log('disconnected');
      socket.close();
    }
  }, [])

  return (
    <div className="overall-container">
      <MyNavBar setSearchText={setSearchText}/>
      <Container fluid className="main-container p-0">
        <Row className="flex-xl-nowrap h-100">
          <MySideBar chosen={chosenSideBarItem}
                     choose={setChosenSideBarItem}
                     showAddAnimeModal={setAddAnimeModalShow}
                     setSearchText={setSearchText}/>
          <AnimeGrid rating={chosenSideBarItem} searchText={searchText}/>
        </Row>
      </Container>
      <AddAnimeRecordModal
        show={addAnimeModalShow}
        onHide={() => setAddAnimeModalShow(false)}/>
    </div>
  )
}

export default AnimeRecord;