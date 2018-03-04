import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

export default class Fixture extends Component {
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
	render() {
		const { match_hometeam_name,
						match_hometeam_score,
						match_awayteam_name,
						match_awayteam_score } = this.props.fixture;

		return (
			<tr>
				<td>{this.convertToLocalTime()}</td>
				<td>{match_hometeam_name}</td>
				<td>{match_hometeam_score} - {match_awayteam_score}</td>
				<td>{match_awayteam_name}</td>
			</tr>
		);
	}
}
