import './assets/css/App.css';
// import "slick-carousel/slick/slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'contexts/auth.context';
import App from './App';
import { Provider } from 'react-redux';
// import {store, persistor} from "./store/store"
import store from './store/store';
// import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
let user = localStorage.getItem('user');
user = JSON.parse(user);

root.render(
  <Provider store={store}>
    <AuthProvider userData={user}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </Provider>,
);
