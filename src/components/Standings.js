import React, { Component } from 'react';
import axios from 'axios';
import * as constants from '../constants/constants';

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
			let standings = data.data;

			// Add the Goal Difference pairing.
			standings.forEach((e) => e['overall_league_GD'] = (e['overall_league_GF'] - e['overall_league_GA']).toString());

			// Sort Standings by Overall Standings ASC (default).
			standings.sort((a,b) => a.overall_league_position - b.overall_league_position)

			this.setState({ standings })
		});
	}

	sortTable(column) {
		const columnID = column.target.id;
		let standings = null,
				sortDirectin = '',
				classList = column.target.classList,
				arrows = document.getElementsByClassName('standings__arrow');

		if (this.state.standings) {
			standings = this.state.standings;

			// Clear all the active Arrows.
			for (let i = 0; i < arrows.length; i++) arrows[i].innerHTML = '';

			// Sort Alphabetically.
			if (classList.contains('--non-numeric')) {
				if (this.state.sortDirectin === 'ASC') {
					standings.sort((a,b) => a[columnID].localeCompare(b[columnID]));
					sortDirectin = 'DESC';
				} else {
					standings.sort((a,b) => b[columnID].localeCompare(a[columnID]));
					sortDirectin = 'ASC';
				}
			} else {
				// Sort Numerically.
				if (this.state.sortDirectin === 'ASC') {
					standings.sort((a, b) => b[columnID] - a[columnID]);
					sortDirectin = 'DESC';
				} else {
					standings.sort((a, b) => a[columnID] - b[columnID]);
					sortDirectin = 'ASC';
				}
			}

			// Find the arrow selector that resides under the clicked table header and assign it.
			let arrow = document.getElementById(columnID).querySelector('.standings__arrow');
			arrow.innerHTML = (sortDirectin === 'ASC' ? '&#x25B2;' : '&#x25BC;');

			this.setState({ standings, sortDirectin });
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
										<span className='standings__label'>#</span>
										<span className='standings__arrow'></span>
									</th>
									<th width='45%' id='team_name' className='--non-numeric' onClick={(e) => this.sortTable(e)}>
										<span className='standings__label'>Team</span>
										<span className='standings__arrow'></span>
									</th>
									<th width='5%' id='overall_league_GF' onClick={(e) => this.sortTable(e)}>
										<span className='standings__label'>MP</span>
										<span className='standings__arrow'></span>
									</th>
									<th width='5%' id='overall_league_W' onClick={(e) => this.sortTable(e)}>
										<span className='standings__label'>W</span>
										<span className='standings__arrow'></span>
									</th>
									<th width='5%' id='overall_league_D' onClick={(e) => this.sortTable(e)}>
										<span className='standings__label'>D</span>
										<span className='standings__arrow'></span>
									</th>
									<th width='5%' id='overall_league_L' onClick={(e) => this.sortTable(e)}>
										<span className='standings__label'>L</span>
										<span className='standings__arrow'></span>
									</th>
									<th width='5%' id='overall_league_GD' onClick={(e) => this.sortTable(e)}>
										<span className='standings__label'>G</span>
										<span className='standings__arrow'></span>
									</th>
									<th width='5%' id='overall_league_PTS' onClick={(e) => this.sortTable(e)}>
										<span className='standings__label'>PTS</span>
										<span className='standings__arrow'></span>
									</th>
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
										<td className='--goal-difference'>{s.overall_league_GF}:{s.overall_league_GA}</td>
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
