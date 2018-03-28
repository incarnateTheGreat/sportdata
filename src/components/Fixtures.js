import React, { Component } from 'react';
import Fixture from './Fixture';
import axios from 'axios';
import moment from 'moment';
import * as constants from '../constants/constants';

// Redux
import { connect } from 'react-redux';
import store from "../store/index";
import { isLoading } from "../actions/index";

class Fixtures extends Component {
	constructor(props) {
		super();

		this.state = {
			fixtures: [],
			h2h_list: []
		};
	}

	getNextFiveDays() {
		const from = moment().subtract(20, 'day').format('YYYY-MM-DD'),
					to = moment().add(10, 'day').format('YYYY-MM-DD');

		return { from, to }
	}

	getFixtures() {
		const { from, to } = this.getNextFiveDays(),
					url = `https://apifootball.com/api/?action=get_events&match_live=1&from=${from}&to=${to}&league_id=63&APIkey=${constants.API_FOOTBALL}`;
		let tempArr = [],
				fixtures = []

		// Return Fixture Data and group by date.
		this.getData(url).then(data => {
			tempArr = data.data.reduce((r, a) => {
				r[a.match_date] = r[a.match_date] || [];
				r[a.match_date].push(a);
				return r;
			}, []);

			// In order to loop through the array, we will push the objects into an array format.
			for(let x in tempArr) fixtures.push(tempArr[x]);

			// Make today's or the most current fixtures listed first.
			fixtures.reverse();

			// Apply into the State.
			this.setState({ fixtures }, () => {
				console.log('Fixtures loaded. Call Redux...');
				store.dispatch(isLoading(false));
			});
		});
	}

	async getData(url) {
		return await axios(url);
	}

	componentDidMount() {
		this.getFixtures();
	}

  render() {
		return (
			<section className='fixtures'>
				{this.state.fixtures.map((fixture, i) =>
					<div className='fixture-table' key={i}>
						<div className='fixture-table__row date'>
							<div>{moment(fixture[0].match_date).format('MMMM DD, YYYY')}</div>
						</div>
						{fixture.map((e, j) => <Fixture fixture={e} key={j} />)}
					</div>
				)}
			</section>
		)
  }
}

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

export default connect(mapStateToProps)(Fixtures);
