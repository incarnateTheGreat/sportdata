import React, { Component } from 'react';
import { ScaleLoader } from 'react-spinners';
import { withRouter } from 'react-router';
import Header from './components/Header';
import Main from './Main';
import './styles/styles.scss';

// Redux
import { connect } from 'react-redux';
import store from "./store/index";
import { isLoading } from "./actions/index";

class App extends Component {
	constructor() {
		super();

		store.dispatch(isLoading(true));
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			store.dispatch(isLoading(true));
		}
	}

	render() {
		return (
			<div className='App'>
				<div className={'loading-spinner ' + (this.props.isLoading ? null : '--hide-loader')}>
					<ScaleLoader
						color={'#123abc'}
					/>
				</div>
				<Header />
				<Main />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

export default withRouter(connect(mapStateToProps)(App));
