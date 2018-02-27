import React, { Component } from 'react';
import Header from './components/Header';
import TeamData from './components/TeamData';
import './styles/styles.scss';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Header />
				<TeamData />
			</div>
		);
	}
}

export default App;
