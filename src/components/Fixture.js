import React, { Component } from 'react';
import FixtureData from './FixtureData';
import H2HData from './H2HData';
import * as constants from '../constants';
import classNames from 'classnames';
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';

export default class Fixture extends Component {
	constructor() {
		super();

		this.state = {
			isLoading: false,
			h2h_data: null
		};
	}
	handleMatchTime() {
		// Return the Match Status if it's either Live or not a Timestamp.
		if ((this.props.fixture.match_status === 'FT' || this.props.fixture.match_status === 'Postp.')
			&& this.props.fixture.match_live === '1') {
			return this.props.fixture.match_status;
		}

		const m = moment.utc(this.props.fixture.match_time, 'HH:mm'),
					tz = moment.tz.guess(),
					modifiedTimeStr = m.clone().tz(tz);

		// Check if the Moment Date is valid. If not, return the original Match Time.
		return modifiedTimeStr.isValid() ? modifiedTimeStr.format('HH:mm') : this.props.fixture.match_time;
	}

	renderMatchData(e) {
		const node = e.target,
					nodeElem = document.getElementById(`${node.id}-data`),
					nodeH2HElem = document.getElementById(`${node.id}-H2H-data`),
					allDataElems = document.querySelectorAll('.fixture-data'),
					allH2HElems = document.querySelectorAll('.h2h-data'),
					fixture = this.props.fixture;

		if (nodeElem.classList.contains('--active')) {
			nodeElem.classList.remove('--active');
			nodeH2HElem.classList.remove('--active');
		} else {
			// Close all Fixture & H2H Data Drawers. This also allows for toggling.
			allDataElems.forEach(elem => elem.classList.remove('--active'));
			allH2HElems.forEach(elem => elem.classList.remove('--active'));

			// Sets the selected Fixture Data Drawer to Active.
			nodeElem.classList.add('--active');

			// If a Match is has not been played, render the H2H Data.
			if (fixture.match_live !== "1") {
				nodeH2HElem.classList.add('--active');

				// If the Fixture H2H State data has already been collected and stored
				// in the State, then do not call for it again.
				if (!this.state.h2h_data) this.getH2HData(fixture);
			}
		}
	}

	setMatchRowClass() {
		const fixture = this.props.fixture,
					disabled = (fixture.match_status === "Postp."
											|| (fixture.match_awayteam_score === "?" && fixture.match_hometeam_score === "?"));

		return classNames(
			'fixture-table__row',
			disabled ? 'fixture-table__row--disabled' : null
		);
	}

	getH2HData({match_hometeam_name, match_awayteam_name}) {
		const url = `https://apifootball.com/api/?action=get_H2H&firstTeam=${match_hometeam_name}&secondTeam=${match_awayteam_name}&APIkey=${constants.API_FOOTBALL}`;

		this.setState({ isLoading: true }, () => {
			this.getData(url).then(data => {
				this.setState(prevState => ({
					isLoading: false,
					h2h_data: data.data
				}));
			});
		});
	}

	async getData(url) {
		return await axios(url);
	}

	displayRedCards(side) {
		const { statistics } = this.props.fixture;
		let arrayRedCardsElems = [];

		// Filter out Statistics and keep the Red Cards.
		const redCards = statistics.filter(statistic => statistic['type'] === 'red cards');

		// Find Red Cards for the Side being evaluated and create Red Card elements.
		for (let i = 0; i < redCards.length; i++) {
			if (redCards[i][side] > 0) {
				arrayRedCardsElems.push(<span className='icon red-card' key={i}></span>);
			}
		}

		return arrayRedCardsElems;
	}

	render() {
		const { match_hometeam_name,
						match_hometeam_score,
						match_awayteam_name,
						match_awayteam_score } = this.props.fixture;

		return (
			<div id={`match-${this.props.fixture.match_id}`} className={this.setMatchRowClass()} onClick={(e) => this.renderMatchData(e)}>
				<div className='fixture-table__row__scoreline'>
					<div className='fixture-table__row__element'>
						<div className='fixture-table__row__red-cards'>{this.displayRedCards('home')}</div>
						<span className='fixture-table__row__scoreline__label'>{match_hometeam_name}</span>
					</div>
					<div className='fixture-table__row__element --score'>
						{match_hometeam_score} - {match_awayteam_score}
						<div className='fixture-table__row__time'>{this.handleMatchTime()}</div>
					</div>
					<div className='fixture-table__row__element'>
						<span className='fixture-table__row__scoreline__label'>{match_awayteam_name}</span>
						<div className='fixture-table__row__red-cards'>{this.displayRedCards('away')}</div>
					</div>
				</div>
				<FixtureData
					id={`match-${this.props.fixture.match_id}-data`}
					fixture={this.props.fixture} />
				<H2HData
					id={`match-${this.props.fixture.match_id}-H2H-data`}
					isLoading={this.state.isLoading}
					data={this.state.h2h_data} />
			</div>
		);
	}
}
