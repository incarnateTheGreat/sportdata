import React, { Component } from 'react';
import FixtureData from './FixtureData';
import moment from 'moment';
import 'moment-timezone';

export default class Fixture extends Component {
	handleMatchTime() {
		if (this.props.fixture.match_status === 'FT' || this.props.fixture.match_status === 'Postp.') {
			return this.props.fixture.match_status;
		}

		const m = moment.utc(this.props.fixture.match_time, 'HH:mm'),
					tz = moment.tz.guess();

		let modifiedTimeStr = m.clone().tz(tz);

		// Check if the Moment Date is valid. If not, return the original Match Time.
		return modifiedTimeStr.isValid() ? modifiedTimeStr.format('HH:mm') : this.props.fixture.match_time;
	}

	renderMatchData(e) {
		const node = e.target,
					dataElem = document.getElementById(`${node.id}-data`),
					allDataElems = document.querySelectorAll('.fixture-data');

		if (dataElem.classList.contains('--active')) {
			dataElem.classList.remove('--active');
		} else {
			// Close all Fixture Data Drawers. This also allows for toggling.
			allDataElems.forEach(elem => elem.classList.remove('--active'));

			console.log(this.props.fixture);

			dataElem.classList.add('--active');
		}
	}

	render() {
		const { match_hometeam_name,
						match_hometeam_score,
						match_awayteam_name,
						match_awayteam_score } = this.props.fixture;

		return (
			<div id={`match-${this.props.fixture.match_id}`} className='fixture-table__row' onClick={(e) => this.renderMatchData(e)}>
				<div className='fixture-table__row__scoreline'>
					<div className='fixture-table__row__scoreline__element'>{match_hometeam_name}</div>
					<div className='fixture-table__row__scoreline__element'>
						{match_hometeam_score} - {match_awayteam_score}
						<div className='fixture-table__row__time'>{this.handleMatchTime()}</div>
					</div>
					<div className='fixture-table__row__scoreline__element'>{match_awayteam_name}</div>
				</div>
				<FixtureData id={`match-${this.props.fixture.match_id}-data`} fixture={this.props.fixture} />
			</div>
		);
	}
}
