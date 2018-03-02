import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';

class Header extends Component {
	constructor(props) {
		super()

		this.navigateTo = this.navigateTo.bind(this);
	}
	navigateTo(path) {
		this.props.history.push(path);
	}

  render() {
		return (
			<header>
				<h1>Sport Data</h1>
				<nav>
					<ul>
						<li onClick={() => this.navigateTo('/')}>Home</li>
						<li onClick={() => this.navigateTo('/standings')}>Standings</li>
					</ul>
				</nav>
			</header>
		)
  }
}

export default withRouter(Header);
