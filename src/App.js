import React, { Component } from 'react';
import { ScaleLoader } from 'react-spinners';
import { withRouter } from 'react-router';
import Header from './components/Header';
import Main from './Main';
import './styles/styles.scss';

// Redux
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
		// this.executeSpinner();
		console.log('did mount.');
		store.dispatch(isLoading(false));
		// console.log(store.getState());
		// TODO: Find a way to re-render render() after Store updates.
	}

	componentDidUpdate(prevProps) {
		// if (this.props.location.pathname !== prevProps.location.pathname) {
		// 	this.setState({ loading: true }, () => {
		// 		this.executeSpinner();
		// 	});
		// }
	}

	// executeSpinner() {
	// 	setTimeout(() => {
	// 		this.setState({ loading: false })
	// 	}, 500)
	// }

	render() {
		// const isLoading = store.getState().isLoading;

		console.log(store.getState());

		return (
			<div className='App'>
				<div className={'loading-spinner ' + (store.getState().isLoading ? null : '--hide-loader')}>
					<ScaleLoader
						color={'#123abc'}
						loading={store.getState().isLoading}
					/>
				</div>
				<Header />
				<Main />
			</div>
		);
	}
}

export default withRouter(App);
