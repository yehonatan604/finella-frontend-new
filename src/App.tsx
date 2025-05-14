import store from "./Core/store/store";
import AppRouter from "./Core/router/AppRouter";
import Layout from "./Common/components/layout/Layout";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <AppRouter />
          <ToastContainer />
        </Layout>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
