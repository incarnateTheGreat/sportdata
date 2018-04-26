import React, { Component } from 'react';
import FixtureData from './FixtureData';
import H2HData from './H2HData';
import * as constants from '../constants/constants';
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';

export default class Fixture extends Component {
	constructor() {
		super();

		this.state = {
			isLoading: false,
			isActive: false,
			h2h_data: null
		};
	}
	handleMatchTime() {
		const { fixture } = this.props;

		// Return the Match Status if it's either Live or not a Timestamp.
		if ((fixture.match_status === 'FT' || fixture.match_status === 'Postp.')
			&& fixture.match_live === '1') {
			return fixture.match_status;
		}

		// Get Current Match Status Time
		if (fixture.match_live === '1' && fixture.match_status !== '') {
			return fixture.match_status;
		}

		const m = moment.utc(fixture.match_time, 'HH:mm'),
					tz = moment.tz.guess(),
					modifiedTimeStr = m.clone().tz(tz);

		// Check if the Moment Date is valid. If not, return the original Match Time.
		return modifiedTimeStr.isValid() ? modifiedTimeStr.format('HH:mm') : fixture.match_time;
	}

	renderMatchData(e) {
		const fixture = this.props.fixture,
					node = e.currentTarget,
					allDataElems = document.querySelectorAll('.fixture-data'),
					allH2HElems = document.querySelectorAll('.h2h-data'),
					fixture = this.props.fixture;

					console.log(fixture);
		// Close all child elements of Fixture.
		allDataElems.forEach(elem => {
			if (elem.id !== id && elem.classList.contains('--active')) {
				elem.classList.remove('--active')
			}
		});

		allH2HElems.forEach(elem => {
			if (elem.id !== id && elem.classList.contains('--active')) {
				elem.classList.remove('--active')
			}
		});

		// If the Fixture H2H State data has already been collected and stored
		// in the State, then do not call for it again.

		// Only render this data if the Match has not gone live yet, and there's
		// no stored data in the State.
		if (!this.state.h2h_data && fixture.match_live !== "1") this.getH2HData(fixture);

		// Toggles child elements of Fixture.
		node.childNodes.forEach(elem => {
			if (elem.classList.contains('--active')) {
				elem.classList.remove('--active')
			} else {
				elem.classList.add('--active')
			}
		});
	}

	setMatchRowClass() {
		const fixture = this.props.fixture,
					disabled = (fixture.match_status === "Postp." || fixture.match_status === "Canc.");

		return disabled ? 'fixture-table__row--disabled' : null;
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

	async getData(url) {
		return await axios(url);
	}

	render() {
		const { match_hometeam_name,
						match_hometeam_score,
						match_awayteam_name,
						match_awayteam_score,
						match_live } = this.props.fixture;

		return (
			<div className={this.setMatchRowClass()} id={`match-${this.props.fixture.match_id}`} onClick={(e) => this.renderMatchData(e)}>
			<div className='fixture-table__row'>
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
			</div>
			{match_live === "1" && (
				<FixtureData
					id={`match-${this.props.fixture.match_id}-data`}
					fixture={this.props.fixture}
					isActive={this.state.isActive} />
			)}
			<H2HData
				id={`match-${this.props.fixture.match_id}-H2H-data`}
				isLoading={this.state.isLoading}
				firstTeam={match_hometeam_name}
				secondTeam={match_awayteam_name}
				data={this.state.h2h_data}
				isActive={this.state.isActive} />
			</div>
		);
	}
}
