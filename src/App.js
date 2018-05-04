import React, { Component } from 'react';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import { ScaleLoader } from 'react-spinners';
import { withRouter } from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './Main';
// import './serviceWorkers/pwa';
import './styles/styles.scss';

// Redux
import { connect } from 'react-redux';
import store from "./store/index";
import { isLoading } from "./actions/index";

class App extends Component {
	constructor() {
		super();

		store.dispatch(isLoading(true));

		this.displayNotification = this.displayNotification.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			store.dispatch(isLoading(true));
		}
	}

	displayNotification() {
		if (Notification.permission === 'granted') {
			navigator.serviceWorker.getRegistration().then(reg => {
				reg.showNotification('Holy crap, this works!');
			});

			// navigator.serviceWorker.ready.then(function(registration) {
			// 	console.log(registration);
			// 	registration.showNotification('Vibration Sample', {
			// 		body: 'Buzz! Buzz!',
			// 		icon: '../images/touch/chrome-touch-icon-192x192.png',
			// 		vibrate: [200, 100, 200, 100, 200, 100, 200],
			// 		tag: 'vibration-sample'
			// 	});
			// });
		}
	}

	componentDidMount() {
		Notification.requestPermission();

		if ('serviceWorker' in navigator) {
			const registration = runtime.register();

			// window.addEventListener('load', function() {
			// 	// navigator.serviceWorker.register('./serviceWorkers/pwa.js');
			// });
		}

		// if ('serviceWorker' in navigator) {
		// 	navigator.serviceWorker
    //     .register('./serviceWorkers/pwa.js')
    //     .then(function() {
    //       console.log('Service Worker Registered');
    //     })
    //     .catch(function(err) {
    //       console.log('ServiceWorker registration failed: ', err);
    //     });
		// }
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
					<button onClick={this.displayNotification}>hey</button>
					<Main />
				</div>
				<Footer />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

export default withRouter(connect(mapStateToProps)(App));
