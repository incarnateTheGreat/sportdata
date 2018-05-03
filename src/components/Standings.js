import React, { Component } from 'react';
import axios from 'axios';
import { API_FOOTBALL, LEAGUE_IDS, LEAGUE_POSITION_PLACEMENTS } from '../constants/constants';

// Redux
import { connect } from 'react-redux';
import store from "../store/index";
import { isLoading } from "../actions/index";

class Standings extends Component {
	constructor(props) {
		super();

		this.state = {
			isLoading: false,
			league_id: null,
			standings: [],
			sortDirection: 'ASC'
		}

		this.sortTable = this.sortTable.bind(this);
		this.getLeague = this.getLeague.bind(this);
	}

	async getData(url) {
		return await axios(url);
	}

	getStandings() {
		// Prevent Fixture Loading Spinner from rendering on default load.
		if (this.state.standings.length > 0) {
			store.dispatch(isLoading(true));
		}

		const league_id = this.state.league_id || Object.keys(LEAGUE_IDS)[0],
					cacheTimestamp = new Date().getTime(),
					arrows = document.getElementsByClassName('standings__arrow'),
					url = `https://apifootball.com/api/?action=get_standings&league_id=${league_id}&APIkey=${API_FOOTBALL}&timestamp=${cacheTimestamp}`;

		// Clear all the active Arrows.
		for (let i = 0; i < arrows.length; i++) arrows[i].innerHTML = '';

		// Return Standings Data.
		this.getData(url).then(data => {
			let standings = data.data;

			// Add the Goal Difference pairing.
			standings.forEach((e) => e['overall_league_GD'] = (e['overall_league_GF'] - e['overall_league_GA']).toString());

			// Sort Standings by Overall Standings ASC (default).
			standings.sort((a,b) => a.overall_league_position - b.overall_league_position)

			this.setState({ standings }, () => {
				store.dispatch(isLoading(false));
				this.assignPositionClasses();
			})
		});
	}

	assignPositionClasses() {
		// Get all Table Row elements and assign classes position-based classes to them.
		const tbody = [...document.getElementsByTagName('tbody')[0].children];

		// Remove all position-based classes during re-render.
		tbody.forEach(elem => {
			elem.classList.remove('--promotion', '--playoffs', '--relegation');
		})

		// Apply the position-based classes.
		tbody.forEach(elem => {
			const position = elem.classList[0].split('-').pop();

			if (position < LEAGUE_POSITION_PLACEMENTS[this.state.league_id].promotion) {
				elem.classList.add('--promotion')
			} else if (position < LEAGUE_POSITION_PLACEMENTS[this.state.league_id].playoffs) {
				elem.classList.add('--playoffs')
			} else if (position >= LEAGUE_POSITION_PLACEMENTS[this.state.league_id].relegation) {
				elem.classList.add('--relegation')
			}
		})
	}

	sortTable(column) {
		const columnID = column.target.id,
					classList = column.target.classList,
					arrows = document.getElementsByClassName('standings__arrow');

		let standings = null,
				sortDirection = '';

		if (this.state.standings) {
			standings = this.state.standings;

			// Clear all the active Arrows.
			for (let i = 0; i < arrows.length; i++) arrows[i].innerHTML = '';

			// Sort Alphabetically.
			if (classList.contains('--non-numeric')) {
				if (this.state.sortDirection === 'ASC') {
					standings.sort((a,b) => a[columnID].localeCompare(b[columnID]));
					sortDirection = 'DESC';
				} else {
					standings.sort((a,b) => b[columnID].localeCompare(a[columnID]));
					sortDirection = 'ASC';
				}
			} else {
				// Sort Numerically.
				if (this.state.sortDirection === 'ASC') {
					standings.sort((a, b) => b[columnID] - a[columnID]);
					sortDirection = 'DESC';
				} else {
					standings.sort((a, b) => a[columnID] - b[columnID]);
					sortDirection = 'ASC';
				}
			}

			// Find the arrow selector that resides under the clicked table header and assign it.
			const arrow = document.getElementById(columnID).querySelector('.standings__arrow');
			arrow.innerHTML = (sortDirection === 'ASC' ? '&#x25B2;' : '&#x25BC;');

			this.setState({ standings, sortDirection }, () => {
				this.assignPositionClasses();
			});
		}
	}

	componentDidMount() {
		// Set League ID in State by default if not selected.
		if (!this.state.league_id) {
			this.setState({ league_id: Object.keys(LEAGUE_IDS)[0] }, () => {
				this.getStandings();
			});
		} else {
			this.getStandings();
		}
	}

	getLeague(id) {
		const league_id = id.target.value;

		// Update the State with the most-recently selected League.
		this.setState({ league_id }, () => {
			this.getStandings();
		});
	}

	leagueDropdown() {
		const leagueSelections = [];

		for (let x in LEAGUE_IDS) {
			leagueSelections.push(<option key={LEAGUE_IDS[x]} value={x}>{LEAGUE_IDS[x]}</option>)
		}

		return leagueSelections;
	}

	render() {
		return (
			<section className='standings'>
				{this.state.standings.length > 0 ? (
					<div className='standings__wrapper'>
						<div className='standings__picker'>
							<span className='standings__picker__label'>League:</span>
							<select onChange={this.getLeague}>
								{this.leagueDropdown()}
							</select>
						</div>
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

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

export default connect(mapStateToProps)(Standings);
