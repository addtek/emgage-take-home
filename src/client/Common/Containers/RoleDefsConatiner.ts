import {connect} from 'react-redux';
import { PopulateRoles } from '../../state/role_list/actions';
import { IRoleDef } from '../../Types/Domain';
import RoleDefComponent from '../../Routes/RoleDef/Components';

const mapStateToProps  = (state, ownProps) => {
 return {
     roleDefs: state.roleDefs,
 };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch,
    initRoleList: (payload: IRoleDef[]) => dispatch(PopulateRoles(payload)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(RoleDefComponent);
