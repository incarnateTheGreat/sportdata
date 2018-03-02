import React, { Component } from 'react';
import moment from 'moment';
import 'moment-timezone';

export default class Fixture extends Component {
	convertToLocalTime(match_time) {
		const m = moment.utc(match_time, 'HH:mm'),
					tz = moment.tz.guess();

		let modifiedTimeStr = m.clone().tz(tz);

		// Check if the Moment Date is valid. If not, return the original Match Time.
		return modifiedTimeStr.isValid() ? modifiedTimeStr.format('HH:mm ZZ') : match_time;
	}
	render() {
		const { match_hometeam_name,
						match_awayteam_name,
						match_time } = this.props.fixture;

		return (
			<tr>
				<td>{match_hometeam_name}</td>
				<td>{match_awayteam_name}</td>
				<td>{this.convertToLocalTime(match_time)}</td>
			</tr>
		);
	}
}
