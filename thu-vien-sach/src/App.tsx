import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import "./App.css";
import store from "./redux/store";
import Routers from "./routers/Routers";

function App() {
  return (
    <div className="App">
      {
        <ConfigProvider>
          <Provider store={store}>
            <Routers />
          </Provider>
        </ConfigProvider>
      }
    </div>
  );
}

export default App;
