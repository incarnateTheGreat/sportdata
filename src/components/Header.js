import React, { Component } from 'react';
import { withRouter } from 'react-router';

// Redux
import { connect } from 'react-redux';

class Header extends Component {
	constructor(props) {
		super()

		this.navigateTo = this.navigateTo.bind(this);
	}

	navigateTo(path) {
		this.props.history.push(path);
	}

	activeClass(path) {
		return this.props.location.pathname === path ? 'active' : '';
	}

  render() {
		return (
			<header>
				{!this.props.isLoading && (
					<div>
						<h1>Sport Data</h1>
						<nav>
							<ul>
								<li className={this.activeClass('/')} onClick={() => this.navigateTo('/')}>Fixtures</li>
								<li className={this.activeClass('/standings')} onClick={() => this.navigateTo('/standings')}>Standings</li>
							</ul>
						</nav>
					</div>
				)}
			</header>
		)
  }
}

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

export default withRouter(connect(mapStateToProps)(Header));
