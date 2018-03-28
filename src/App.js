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

// store.subscribe(() => console.log('Look ma, Redux!!'))

class App extends Component {
	constructor() {
		super();

		this.state = {
			loading: true
		};

		store.dispatch(isLoading(true));
	}

	componentDidMount() {
		// store.dispatch(isLoading(false));
		// this.closeSpinner();
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			// console.log('Path change.');
			store.dispatch(isLoading(true));

			this.closeSpinner();
		}
	}

	closeSpinner() {
		console.log('Close Spinner.');

		setTimeout(() => {
			store.dispatch(isLoading(false));
		}, 1000)
	}

	render() {
		return (
			<div className='App'>
				<div className={'loading-spinner ' + (this.props.isLoading ? null : '--hide-loader')}>
					<ScaleLoader
						color={'#123abc'}
						loading={this.props.isLoading}
					/>
				</div>
				<Header />
				<Main />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

// export default withRouter(App);
export default withRouter(connect(mapStateToProps)(App));
