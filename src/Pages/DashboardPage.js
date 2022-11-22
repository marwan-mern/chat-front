import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom"
import makeToast from "../Toaster";


const DashboardPage = (props) => {
  const history = useHistory()
  const [chatrooms, setChatrooms] = React.useState([]);
  const [RoomName, setRoomName] = React.useState();
  const Logout=()=>{
    localStorage.removeItem("CC_Token");
    history.push("/")
  }

  const getChatrooms = () => {
    axios
      .get("https://marwan-chat-app.onrender.com/chatroom", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        setChatrooms(response.data);
      })
      .catch((err) => {
        setTimeout(getChatrooms, 3000);
      });
  };
  const createRooom = (RoomName) => {
    axios
      .post("https://marwan-chat-app.onrender.com/chatroom", { name: RoomName }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("CC_Token"),
        },
      })
      .then((response) => {
        makeToast("success", response.data.message);
        getChatrooms()
      })
      .catch((err) => {
        console.log(err)
      });
  }

  React.useEffect(() => {
    getChatrooms();
    // eslint-disable-next-line
  }, []);

  return (<>
    <button className="LogoutBoard" onClick={Logout}>
      Logout
    </button>
    <div className="card">
      <div className="cardHeader">Chatrooms</div>
      <div className="cardBody">
        <div className="inputGroup">
          <label htmlFor="chatroomName">Chatroom Name</label>
          <input
            type="text"
            name="chatroomName"
            id="chatroomName"
            placeholder="ChatterBox Nepal"
            onChange={(e) => { setRoomName(e.target.value) }}
          />
        </div>
      </div>
      <button onClick={() => { createRooom(RoomName) }}>Create Chatroom</button>
      <div className="chatrooms">
        {chatrooms.map((chatroom) => (
          <div key={chatroom._id} className="chatroom">
            <div>{chatroom.name}</div>
            <Link to={"/chatroom/" + chatroom._id}>
              <div className="join">Join</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  </>
  );
};

export default DashboardPage;
