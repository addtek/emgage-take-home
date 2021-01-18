import 'url-search-params-polyfill';
import * as React from 'react';

import { Route, Router, browserHistory} from 'react-router'; // Adds Routing capabilities
import RoleDefComponent from './Common/Containers/RoleDefsConatiner';
import PageNotFoundComponent from './Routes/PageNotFound';

export default class MainRouter extends React.Component {
  render() {
    return (
        <Router history= {browserHistory}>
            <Route path="/roleDefs" component={RoleDefComponent} />
            <Route path="*" component={PageNotFoundComponent} />
        </Router>
    );
  }
}
