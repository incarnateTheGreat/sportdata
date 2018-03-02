import React, { Component } from 'react';

export default class Header extends Component {
  render() {
		return (
			<header>
				<h1>Sport Data</h1>
				<nav>
					<ul>
						<li>Home</li>
						<li>Standings</li>
					</ul>
				</nav>
			</header>
		)
  }
}
