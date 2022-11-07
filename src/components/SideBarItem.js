import './SideBarItem.css'
import {Badge} from "react-bootstrap";

function SideBarItem(props) {
  return (
    <div className="sidebar-item">
      <div className="sidebar-item__content">
        {props.sideBarText}
        <Badge pill bg="dark" className="ms-1">{props.recordCount}</Badge>
      </div>
    </div>
  );
}

export default SideBarItem;