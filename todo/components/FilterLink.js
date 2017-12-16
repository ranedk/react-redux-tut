import { connect } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import Link from './Link';

const mapStateToLinkProps = (
  state,
  ownProps
) => {
  return {
    active: state.get('visibilityFilter') === ownProps.filter
  }
};

const mapDispatchToLinkProps = (
  dispatch,
  ownProps
) => {
  return {
    onLinkClick: () => {
      dispatch(setVisibilityFilter(ownProps.filter))
    }
  }
}

const FilterLink = connect(
  mapStateToLinkProps,
  mapDispatchToLinkProps
)(Link)

export default FilterLink;
