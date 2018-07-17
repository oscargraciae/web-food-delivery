import React from 'react';
import { Provider } from 'react-redux';
import { persistStore, WebStorage } from 'redux-persist';
//import storage from 'redux-persist/lib/storage'
import createExpirationTransform from 'redux-persist-transform-expire';
import axios from 'axios';
import decode from 'jwt-decode';

import { getTokenFromCookie, getTokenFromLocalStorage } from '../utils/auth';
import redirect from '../utils/redirect';
import store from '../redux/store';
import api from '../api';
import { initUserGA, logPageView, setUser } from '../config/analytics';

// import components
import ModalAddress from '../components/general/ModalAddress'

export default Page => class DefaultPage extends React.Component {
  static async getInitialProps(context) {
    const loggedUser = process.browser ? getTokenFromLocalStorage() : getTokenFromCookie(context.req);
    const props = await Page.getInitialProps(context);
    const token = loggedUser;
    let user = null;

    if (!token) {
      delete axios.defaults.headers.common['Authorization'];
      redirect('/', context);
    } else {
      axios.defaults.headers.common['Authorization'] = `JWT ${token}`;

      const tokenDecode = decode(token);
      user = await api.user.get(tokenDecode.id);
    }

    return {
      ...props,
      loggedUser,
      currentUrl: context.pathname,
      isAuthenticated: !!loggedUser,
      user,
    };
  }

  componentWillMount() {
    const token = this.props.loggedUser;
    if(token) {
      axios.defaults.headers.common['Authorization'] =  `JWT ${token}`;
    }
  }


  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      const user = this.props.user;
      initUserGA(user);
      setUser(user);
      dataLayer.push({ userId: user.id });
      window.GA_INITIALIZED = true;
    }
    logPageView();
    
    const expireTransform = createExpirationTransform({
      expireKey: 'persistExpiresAt',
      defaultState: {
        data: [],
      }
    });

    persistStore(
      store,
      {
        whitelist: [ 'cart' ],
        transforms: [expireTransform]
      },
      () => this.setState({ ready: true })
    );
  }

  render() {
    const token = this.props.loggedUser;
    return (
      <Provider store={store}>
        <Page {...this.props}/>
      </Provider>
    );
  }
};

