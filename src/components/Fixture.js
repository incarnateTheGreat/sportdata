import React, { Component } from 'react';

export default class Fixture extends Component {
	render() {
		const { match_date,
						match_hometeam_name,
						match_awayteam_name,
						match_time } = this.props.fixture;

						console.log(this.props.fixture);

		return (
			<tr>
				<td>{match_date}</td>
				<td>{match_hometeam_name}</td>
				<td>{match_awayteam_name}</td>
				<td>{match_time}</td>
			</tr>
		);
	}
}
