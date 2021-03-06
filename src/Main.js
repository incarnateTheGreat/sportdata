import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Fixtures from './components/Fixtures';
import Standings from './components/Standings';

class Main extends Component {
	render() {
		return (
			<main>
				<Switch>
					<Route exact path='/' component={Fixtures}></Route>
					<Route path='/standings' component={Standings}></Route>
				</Switch>
			</main>
		);
	}
}

export default Main;
