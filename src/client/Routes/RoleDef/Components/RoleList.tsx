import { themr, ThemedComponentClass } from '@friendsofreactjs/react-css-themr';
import { IRoleListState } from './RoleListState';
import { IRoleListProp } from './RoleListProp';
import { ROLE } from '../../../ThemeIdentifiers';

import * as baseTheme from '../Styles/RoleList.scss';
import { RoleListComponent } from './RoleListComponent';

export default themr(ROLE, baseTheme)(RoleListComponent) as ThemedComponentClass<IRoleListProp, IRoleListState>;
