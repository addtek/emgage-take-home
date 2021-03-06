import * as React from 'react';

import { ThemeContext } from '../../../Context';
import RoleListComponent from './RoleList';

/**
 * Root component which calls the list component to show the existing role list
 * Then list component calls different other components like create, members, etc
 * @extends React.Component
 */
export default class RoleDefComponent extends React.Component<any> {
  /**
   * Render the component to the DOM
   * @returns {}
   */
  render() {
    return (
      <div>
        <ThemeContext.Consumer>
          {
            theme => (
              <RoleListComponent
                theme={theme}
                roleDefs={this.props.roleDefs}
                dispatch={this.props.dispatch}
                initRoleList={this.props.initRoleList}
              />
            )
          }
        </ThemeContext.Consumer>
      </div>
    );
  }
}
