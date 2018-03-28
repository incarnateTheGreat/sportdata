import React, { Component } from 'react';
import { withRouter } from 'react-router';
import moment from 'moment';

class Footer extends Component {
  constructor(props) {
		super();

		this.navigateTo = this.navigateTo.bind(this);
	}

  navigateTo(path) {
		this.props.history.push(path);
	}

	activeClass(path) {
		return this.props.location.pathname === path ? 'active' : '';
	}

  render() {
    const currentYear = moment().format('YYYY');

		return (
			<footer className='footer'>
        <div className='footer__wrapper'>
          <nav>
  					<ul>
  						<li className={this.activeClass('/')} onClick={() => this.navigateTo('/')}>Fixtures</li>
  						<li className={this.activeClass('/standings')} onClick={() => this.navigateTo('/standings')}>Standings</li>
  					</ul>
  				</nav>
          <span>&copy; {currentYear} Sport Data.</span>
        </div>
			</footer>
		)
  }
}

export default withRouter(Footer);
