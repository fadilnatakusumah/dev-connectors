import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';

// Redux 
import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Wrapper from './components/layout/Wrapper';
import Alert from './components/layout/Alert';

import './App.css';

import Signup from './components/auth/Signup';
import Login from './components/auth/Signin';
import { loadUser } from './store/actions/authAction';
import { setAuthToken } from './utils/setTokenAuth';
import PrivateRoute from './components/routing/PrivateRoute';

const Home = lazy(() => import('./components/home/Home'));
const UpdateProfile = lazy(() => import('./components/profile/UpdateProfile'));
const Developers = lazy(() => import('./components/developers/Developers'));
const DetailDeveloper = lazy(() => import('./components/developers/DetailDeveloper'));

const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="App">
          <Switch>
            <Route path='/' exact component={Landing} />
            <Wrapper>
              <Alert />
              <Suspense fallback={null}>
                <PrivateRoute path='/home' component={Home} />
                <PrivateRoute path='/profile/create' component={UpdateProfile} />
                <PrivateRoute path='/profile/update' component={UpdateProfile} />
                <PrivateRoute path='/profile/detail/:id' component={DetailDeveloper} />
                <Route path='/developers' component={Developers} />
              </Suspense>
              <Route path='/signup' component={Signup} />
              <Route path='/signin' component={Login} />
            </Wrapper>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}


export default App;
