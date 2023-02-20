import MyNavBar from "./components/MyNavBar";
import {Container} from "react-bootstrap";
import MySideBar from "./components/MySideBar";
import AddAnimeRecordModal from "./components/AddAnimeRecordModal";
import {useEffect, useState} from "react";
import './AnimeRecord.css';
import {BASE_URL_WS} from "./global/network";
import PopupAlert from "./components/PopupAlert";
import {useSelector} from "react-redux";
import {animated, useTransition} from "@react-spring/web";
import AnimeMasonryList from "./components/AnimeMasonryList";

const socket = new WebSocket(BASE_URL_WS);

function AnimeRecord() {
  const [chosenSideBarItem, setChosenSideBarItem] = useState(0);
  const [addAnimeModalShow, setAddAnimeModalShow] = useState(false);

  // state for info controlled by websocket
  // TODO use redux to manage state? should have better implementation
  const [loadingMsgOfAddAnime, setLoadingMsgOfAddAnime] = useState('请稍等...');
  const showPopupAlert = useSelector(state => state.globalStatus.showPopupAlert);
  const transition = useTransition(showPopupAlert, {
    from: {y: 100},
    enter: {y: 0},
    leave: {y: 100},
  });

  useEffect(() => {
    socket.onopen = () => {
      console.log('connected');
    };

    socket.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === 'message') {
      //  if msg data contains 'fetching', set loadingMsgOfAddAnime to 正在获取动画元数据...
      //  if msg data contains 'fetched', set loadingMsgOfAddAnime to 正在添加动画记录...
        if (msg.data.includes('fetching')) {
          setLoadingMsgOfAddAnime('正在获取动画元数据...');
        } else if (msg.data.includes('fetched')) {
          setLoadingMsgOfAddAnime('正在添加动画记录...');
        }
      }
      console.log(e.data);
    };

    return () => {
      console.log('disconnected');
      socket.close();
    }
  }, [])

  return (
    <>
      <div className="overall-container">
        <MyNavBar setChosenSideBarItem={setChosenSideBarItem}/>
        <Container fluid className="main-container p-0 row m-0">
          <MySideBar chosen={chosenSideBarItem}
                     choose={setChosenSideBarItem}
                     showAddAnimeModal={setAddAnimeModalShow}/>
          <div className="col-8 col-xl-10 col-md-9 d-flex flex-column ms-0 p-0">
            <AnimeMasonryList rating={chosenSideBarItem}/>
          </div>
        </Container>
        <AddAnimeRecordModal
          show={addAnimeModalShow}
          onHide={() => setAddAnimeModalShow(false)}
          loadingmsg={loadingMsgOfAddAnime}/>
      </div>
      {transition((style, item) =>
        item && <animated.div style={style}><PopupAlert/></animated.div>)}
    </>
  )
}

export default AnimeRecord;