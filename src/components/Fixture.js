import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

export default class Fixture extends Component {
	constructor(props) {
		super();

		this.openGameData = this.openGameData.bind(this);
	}
	convertToLocalTime() {
		if (this.props.fixture.match_status === 'FT' || this.props.fixture.match_status === 'Postp.') {
			return this.props.fixture.match_status;
		}

		const m = moment.utc(this.props.fixture.match_time, 'HH:mm'),
					tz = moment.tz.guess();

		let modifiedTimeStr = m.clone().tz(tz);

		// Check if the Moment Date is valid. If not, return the original Match Time.
		return modifiedTimeStr.isValid() ? modifiedTimeStr.format('HH:mm') : this.props.fixture.match_time;
	}

	openGameData() {
		console.log(this.props);
	}

	render() {
		const { match_hometeam_name,
						match_hometeam_score,
						match_awayteam_name,
						match_awayteam_score } = this.props.fixture;

		return (
			<div className='fixture-table__row' onClick={this.openGameData}>
				<div className='fixture-table-row__element'>{this.convertToLocalTime()}</div>
				<div className='fixture-table-row__element'>{match_hometeam_name}</div>
				<div className='fixture-table-row__element'>{match_hometeam_score} - {match_awayteam_score}</div>
				<div className='fixture-table-row__element'>{match_awayteam_name}</div>
			</div>
		);
	}
}
