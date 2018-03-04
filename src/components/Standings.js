import React, { Component } from 'react';
import axios from 'axios';
import * as constants from '../constants';

class Standings extends Component {
	constructor(props) {
		super();

		this.state = {
			standings: null
		}
	}
	async getData(url) {
		return await axios(url);
	}

	getStandings() {
		const url = `https://apifootball.com/api/?action=get_standings&league_id=63&APIkey=${constants.API_FOOTBALL}`;

		// Return Standings Data.
		this.getData(url).then(data => {
			console.log(data.data);
			const standings = data.data;

			// Sort Standings by Overall Standings ASC (default).
			standings.sort((a,b) => a.overall_league_position - b.overall_league_position)

			this.setState({ standings })
		});
	}

	componentDidMount() {
		this.getStandings();
	}

	render() {
		return (
			<section className='standings'>
				{this.state.standings ? (
					<table>
						<thead>
							<tr>
								<td width='5%'>#</td>
								<td width='45%'>Team</td>
								<td width='5%'>MP</td>
								<td width='5%'>W</td>
								<td width='5%'>D</td>
								<td width='5%'>L</td>
								<td width='5%'>G</td>
								<td width='5%'>Pts</td>
							</tr>
						</thead>
						<tbody>
							{this.state.standings.map((s, i) =>
								<tr key={i}>
									<td>{s.overall_league_position}</td>
									<td>{s.team_name}</td>
									<td>{s.overall_league_payed}</td>
									<td>{s.overall_league_W}</td>
									<td>{s.overall_league_D}</td>
									<td>{s.overall_league_L}</td>
									<td>{s.overall_league_GF}:{s.overall_league_GA}</td>
									<td>{s.overall_league_PTS}</td>
								</tr>
							)}
						</tbody>
					</table>
				) : ''}
			</section>
		);
	}
}

export default Standings;
