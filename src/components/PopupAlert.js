import {Alert} from "react-bootstrap";
import './PopupAlert.css';
import {useSelector} from "react-redux";


function PopupAlert() {
  const message = useSelector(state => state.globalStatus.popupAlertMsg);
  const variant = useSelector(state => state.globalStatus.popupAlertVariant);
  // FIXME This is called third time with animation, one time without animation
  // console.log('PopupAlert: ' + message);
  return (
    <div className="popup">
      <Alert key={variant} variant={variant}>
        {message}
      </Alert>
    </div>
  );
}

export default PopupAlert;