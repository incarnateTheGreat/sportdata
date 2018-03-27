import React, { Component } from 'react';
import axios from 'axios';
import * as constants from '../constants';

class Standings extends Component {
	constructor(props) {
		super();

		this.state = {
			standings: null,
			sortDirectin: 'ASC'
		}

		this.sortTable = this.sortTable.bind(this);
	}
	async getData(url) {
		return await axios(url);
	}

	getStandings() {
		const url = `https://apifootball.com/api/?action=get_standings&league_id=63&APIkey=${constants.API_FOOTBALL}`;

		// Return Standings Data.
		this.getData(url).then(data => {
			const standings = data.data;

			console.log(data.data);

			// Sort Standings by Overall Standings ASC (default).
			standings.sort((a,b) => a.overall_league_position - b.overall_league_position)

			this.setState({ standings })
		});
	}

	sortTable(column) {
		const columnID = column.target.id;
		let standings = null,
				sortDirectin = '';

		console.log(columnID);

		if (this.state.standings) {
			standings = this.state.standings;

			if (this.state.sortDirectin === 'ASC') {
				standings.sort((a, b) => b[columnID] - a[columnID]);
				sortDirectin = 'DESC';
			} else {
				standings.sort((a, b) => a[columnID] - b[columnID]);
				sortDirectin = 'ASC';
			}


			this.setState({ standings, sortDirectin }, () => {
				console.log(this.state);
			});
		}
	}

	componentDidMount() {
		this.getStandings();
	}

	render() {
		return (
			<section className='standings'>
				{this.state.standings ? (
					<div className='standings__wrapper'>
						<table className='standings__table'>
							<thead>
								<tr>
									<th width='5%' id='overall_league_position' onClick={(e) => this.sortTable(e)}>
										# <span className='standings__arrow'></span>
									</th>
									<th width='45%' id='team_name' className='--non-numeric' onClick={(e) => this.sortTable(e)}>Team</th>
									<th width='5%' id='overall_league_GF' onClick={(e) => this.sortTable(e)}>MP</th>
									<th width='5%' id='overall_league_W' onClick={(e) => this.sortTable(e)}>W</th>
									<th width='5%' id='overall_league_D' onClick={(e) => this.sortTable(e)}>D</th>
									<th width='5%' id='overall_league_L' onClick={(e) => this.sortTable(e)}>L</th>
									<th width='5%' id='overall_league_GoalDifference' onClick={(e) => this.sortTable(e)}>G</th>
									<th width='5%' id='overall_league_PTS' onClick={(e) => this.sortTable(e)}>Pts</th>
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
						<div className='standings__legend'>
							<div className='standings__legend__row'>
								<span className='standings__legend__row__icon --promotion'>&nbsp;</span>
								<span className='standings__legend__row__label'>Promotion</span>
							</div>
							<div className='standings__legend__row'>
								<span className='standings__legend__row__icon --playoffs'>&nbsp;</span>
								<span className='standings__legend__row__label'>Play-Offs</span>
							</div>
							<div className='standings__legend__row'>
								<span className='standings__legend__row__icon --relegation'>&nbsp;</span>
								<span className='standings__legend__row__label'>Relegation</span>
							</div>
						</div>
					</div>
				) : ''}
			</section>
		);
	}
}

export default Standings;
