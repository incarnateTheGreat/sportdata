import React, { Component } from 'react';
import { ScaleLoader } from 'react-spinners';
import { withRouter } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
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

	componentDidMount() {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('sw.js').then((reg) => {
				Notification.requestPermission();
			}, (err) => {
				console.log(err);
			})
		}
	}

	render() {
		return (
			<div className='App'>
				<Header />
				<div className='App__wrapper'>
					<div className={'loading-spinner ' + (this.props.isLoading ? null : '--hide-loader')}>
						<ScaleLoader
							color={'#123abc'}
							loading={this.props.isLoading}
						/>
					</div>
					<Main />
				</div>
				<Footer />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

export default withRouter(connect(mapStateToProps)(App));
