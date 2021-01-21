import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { assert, expect } from 'chai';
import { configure, shallow } from 'enzyme';

import {RoleListComponent} from '../../src/client/Routes/RoleDef/Components/RoleListComponent';
import {IRoleListProp} from '../../src/client/Routes/RoleDef/Components/RoleListProp';
import {IRoleDef} from '../../src/client/Types/Domain/Role';
import {AlertDialog} from '../../src/client/Common/Components/AlertDialog';

import Adapter from 'enzyme-adapter-react-16';
import { PopulateRoles } from 'state/role_list/actions';
import { IRoleListState } from 'Routes/RoleDef/Components/RoleListState';

configure({ adapter: new Adapter() });
describe('App Component Testing', () => {
  let App;
  const DeliciousThemeContext = {
    PButton: require('engage-ui/themes/Delicious/Button.scss'),
    PButtonGroup: require('engage-ui/themes/Delicious/ButtonGroup.scss'),
    PConnected: require('engage-ui/themes/Delicious/Connected.scss'),
    PDisplayText: require('engage-ui/themes/Delicious/DisplayText.scss'),
    PIcon: require('engage-ui/themes/Delicious/Icon.scss'),
    PLabel: require('engage-ui/themes/Delicious/Label.scss'),
    PLabelled: require('engage-ui/themes/Delicious/Labelled.scss'),
    PMessage: require('engage-ui/themes/Delicious/Message.scss'),
    PModal: require('engage-ui/themes/Delicious/Modal.scss'),
    PSelect: require('engage-ui/themes/Delicious/Select.scss'),
    PTextField: require('engage-ui/themes/Delicious/TextField.scss'),
  };
  const roleListProps: IRoleListProp = {
    roleDefs: [

    ],
    theme: DeliciousThemeContext,
    initRoleList: (data) => PopulateRoles(data),
    dispatch: () => null,
  };
  it('Renders ', () => {
    beforeEach(() => {
     App = shallow<RoleListComponent>((
     <RoleListComponent
       theme={roleListProps.theme}
       roleDefs={roleListProps.roleDefs}
       initRoleList={roleListProps.initRoleList}
       dispatch={roleListProps.dispatch}
     />));
    });
    expect(App.type).to.be('div');

  });
});
