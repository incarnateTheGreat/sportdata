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
					<div>
						<table>
							<thead>
								<tr>
									<th width='5%'>#</th>
									<th width='45%' className='--non-numeric'>Team</th>
									<th width='5%'>MP</th>
									<th width='5%'>W</th>
									<th width='5%'>D</th>
									<th width='5%'>L</th>
									<th width='5%'>G</th>
									<th width='5%'>Pts</th>
								</tr>
							</thead>
							<tbody>
								{this.state.standings.map((s, i) =>
									<tr key={i} className={`--position-${s.overall_league_position}`}>
										<td>{s.overall_league_position}</td>
										<td className='--non-numeric'>{s.team_name}</td>
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

						<div className='standings-legend'>
							<div className='standings-legend__row'>
								<span className='standings-legend__row__icon --promotion'>&nbsp;</span>
								<span className='standings-legend__row__label'>Promotion</span>
							</div>
							<div className='standings-legend__row'>
								<span className='standings-legend__row__icon --playoffs'>&nbsp;</span>
								<span className='standings-legend__row__label'>Play-Offs</span>
							</div>
							<div className='standings-legend__row'>
								<span className='standings-legend__row__icon --relegation'>&nbsp;</span>
								<span className='standings-legend__row__label'>Relegation</span>
							</div>
						</div>
					</div>
				) : ''}
			</section>
		);
	}
}

export default Standings;
