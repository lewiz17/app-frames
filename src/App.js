import React, { useState, useEffect } from "react";

import axios from "axios";

const client = axios.create({
  baseURL: "https://url-service-0ds1.onrender.com/items",
});

const App = () => {
  const [target, setTarget] = useState("");
  const [iframe, setIframe] = useState("");
  const [disable, setDisable] = useState(false);
  const [items, setItems] = useState([]);

  const [show, setShow] = useState(false);

  // GET with Axios
  useEffect(() => {
    const fetchItems = async () => {
      try {
        let response = await client.get("?_limit=10");
        setItems(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, []);

  // DELETE with Axios
  const deleteItem = async (id) => {
    try {
      await client.delete(`${id}`);
      setItems(
        items.filter((item) => {
          return item.id !== id;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  // handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addItems(target, iframe, disable);
  };

  const toogleShow = () => {
	setShow(!show);
  }

  // POST with Axios
  const addItems = async (target, iframe, disable) => {
    try {
      let response = await client.post("", {
        target_url: target,
        iframe_url: iframe,
        disable: disable,
      });
      setItems([response.data, ...items]);
      setTarget("");
      setIframe("");
      setDisable(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app">
      <nav>
        <h1>
          ADMIN PANEL<sup>IFIJR</sup>
        </h1>
      </nav>
      <div className="add-url-container">
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            className="form-control"
            placeholder="Type target url"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
          <input
            type="url"
            className="form-control"
            placeholder="Type iframe url"
            value={iframe}
            onChange={(e) => setIframe(e.target.value)}
          />
          <span>
            Run:
            <div class="hold-check">
              <input
                id="run"
                type="checkbox"
                name="run"
                className="check-control"
                checked={!disable}
                onChange={(e) => setDisable(!disable)}
              />
              <label for="run"></label>
            </div>
          </span>
          <button type="submit">Add Iframe</button>
        </form>
      </div>
      <div className="url-container">
        <h2>All Urls</h2>
        {items.map((item) => {
          return (
            <div className="url-item" key={item.id}>
              <h2 className="url-title">{item.target_url}</h2>
              <p className="url-frame">{item.iframe_url}</p>
              <p className="url-body">
                Running:{" "}
                {item.disable === true ? (
                  <span className="running off">No</span>
                ) : (
                  <span className="running">Yes</span>
                )}
              </p>
              <div className="button">
                <div className="delete-btn" onClick={() => deleteItem(item.id)}>
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAm0lEQVR4nO2TQQrCMBBFexwXcRV3tnu9tgW9RwVLvMSTwAilKqXtDJEyDwLDT8iDT1JVzr8C3PjkqnV5ix5tKfFFpY3tghIunsSrFo5ABNI7kDlnNV/QqjrKXhBhXkGyg6U4DURhNCdLceYJ7AfndkDPD6zFD2txKlV1LPW4ahGMv1POGkvxbFw8CXBnPd0S8XmlvANOs8XOZngBROB3cnadELQAAAAASUVORK5CYII="
                    alt="Delete Item"
                  />{" "}
                  Delete
                </div>
              </div>
            </div>
          );
        })}
        <div className="legend">
		  <span className="help" onClick={() => toogleShow()}>HELP ?</span>
		  {
			show === true ? (
				<p className="content-help">
					valid url patterns:
					<em>https://*.domain.com/*</em>
					<em>https://www.netlify.com/</em>
				</p>
			): ''
		  }
          
        </div>
      </div>
    </div>
  );
};

export default App;
