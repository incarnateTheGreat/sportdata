import React, { Component } from 'react';
import { ScaleLoader } from 'react-spinners';
import { withRouter } from 'react-router';
import Header from './components/Header';
import Main from './Main';
import './styles/styles.scss';

class App extends Component {
	constructor() {
		super();

		this.state = {
			loading: true
		};
	}

	componentDidMount() {
		this.executeSpinner();
	}

	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.setState({ loading: true }, () => {
				this.executeSpinner();
			});
		}
	}

	executeSpinner() {
		setTimeout(() => {
			this.setState({ loading: false })
		}, 500)
	}

	render() {
		return (
			<div className='App'>
				<div className={'loading-spinner ' + (this.state.loading ? null : '--hide-loader')}>
					<ScaleLoader
						color={'#123abc'}
						loading={this.state.loading}
					/>
				</div>
				<Header />
				<Main />
			</div>
		);
	}
}

export default withRouter(App);
