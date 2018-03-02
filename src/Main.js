import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import TeamData from './components/TeamData';
import Standings from './components/Standings';

class Main extends Component {
	render() {
		return (
			<main>
				<Switch>
					<Route exact path='/' component={TeamData}></Route>
					<Route path='/standings' component={Standings}></Route>
				</Switch>
			</main>
		);
	}
}

export default Main;
