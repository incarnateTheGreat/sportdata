import React, { Component } from 'react';
import FixtureData from './FixtureData';
import H2HData from './H2HData';
import CustomCheckbox from './Custom-Checkbox';
import { API_FOOTBALL } from '../constants/constants';
import classNames from 'classnames';
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';

export default class Fixture extends Component {
	constructor() {
		super();

		this.state = {
			isNotificationEnabled: false,
			isLoading: false,
			h2h_data: null,
			fixture: [],
			match_hometeam_score: null,
			match_awayteam_score: null,
			match_status: null
		};

		this.toggleFollowMatch = this.toggleFollowMatch.bind(this);
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
					parentNode = e.currentTarget.parentNode,
					allParentElems = document.querySelectorAll('.fixture-table__row-container'),
					childElems = document.querySelectorAll('.--child');

		// If the user clicks on an already-opened drawer, then ignore all the others and just close the clicked drawer.
		// Otherwise, close all the other drawers.
		if (parentNode.classList.contains('--active')) {
			toggleDrawer();
		} else {
			node.classList.add('--active')
			closeAllDrawers();
			toggleDrawer();
		}

		// Closes all the other drawers.
		function closeAllDrawers() {
			childElems.forEach(elem => {
				if (elem.classList.contains('--active')) {
					elem.classList.remove('--active');
				}
			})

			// Remove class from parent.
			allParentElems.forEach(elem => elem.classList.remove('--active'));
		}

		// Toggles clicked element only.
		function toggleDrawer() {
			parentNode.childNodes.forEach(elem => {
				elem.classList.toggle('--active')
			})

			// Remove class from parent.
			parentNode.classList.toggle('--active');
		}

		// Only render this data if the Match has not gone live yet, and there's no stored data in the State.
		if (!this.state.h2h_data && (fixture.match_status === '' || fixture.match_live !== '1')) this.getH2HData(fixture);
	}

	setMatchRowClass() {
		const fixture = this.props.fixture,
					disabled = (fixture.match_status === "Postp." || fixture.match_status === "Canc.");

		return disabled ? 'fixture-table__row--disabled' : 'fixture-table__row-container';
	}

	getH2HData({match_hometeam_name, match_awayteam_name}) {
		const url = `https://apifootball.com/api/?action=get_H2H&firstTeam=${match_hometeam_name}&secondTeam=${match_awayteam_name}&APIkey=${API_FOOTBALL}`;

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

	displayNotification(e, scoreData) {
		if (Notification.permission === 'granted' && this.state.isNotificationEnabled) {
			const { goalscoringTeam,
							match_hometeam_name,
							match_hometeam_score,
							match_awayteam_name,
							match_awayteam_score } = scoreData;

			let matchTime = scoreData.matchTime + "'",
					matchEvent = null;

			if (e === 'goal') {
				matchEvent = `GOAL! ${goalscoringTeam}: ${matchTime}`;
			} else if (e === 'time' && scoreData.matchTime === 'HT') {
				matchEvent = `Half-Time`;
			} else if (e === 'time' && scoreData.matchTime === 'FT') {
				matchEvent = `Full-Time`;
			}

			const title = matchEvent,
						options = {
							body: `${match_hometeam_name} ${match_hometeam_score} : ${match_awayteam_score} ${match_awayteam_name}`
						};

			navigator.serviceWorker.getRegistration().then(reg => {
				reg.showNotification(title, options);
			});
		}
	}

	toggleFollowMatch() {
		this.setState({ isNotificationEnabled: (this.state.isNotificationEnabled ? false : true ) })
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		// The object you return from this function will be merged with the current state.
		return {
			fixture: nextProps.fixture,
			match_hometeam_score: nextProps.fixture.match_hometeam_score,
			match_awayteam_score: nextProps.fixture.match_awayteam_score,
			match_status: nextProps.fixture.match_status };
	}

	shouldComponentUpdate(nextProps, nextState) {
		// Populate State on render.
		if (!this.state.match_hometeam_score) return true;

		// Update State when a Home or Away Goal is scored.
		if (this.state.match_hometeam_score && (this.state.match_hometeam_score !== nextProps.fixture.match_hometeam_score)) {
			this.displayNotification('goal', {
				'goalscoringTeam': nextProps.fixture.match_hometeam_name,
				'matchTime': nextProps.fixture.match_status,
				'match_hometeam_name': nextProps.fixture.match_hometeam_name,
				'match_hometeam_score': nextProps.fixture.match_hometeam_score,
				'match_awayteam_name': nextProps.fixture.match_awayteam_name,
				'match_awayteam_score': nextProps.fixture.match_awayteam_score
			});
		} else if (this.state.match_awayteam_score && (this.state.match_awayteam_score !== nextProps.fixture.match_awayteam_score)) {
			this.displayNotification('goal', {
				'goalscoringTeam': nextProps.fixture.match_awayteam_name,
				'matchTime': nextProps.fixture.match_status,
				'match_hometeam_name': nextProps.fixture.match_hometeam_name,
				'match_hometeam_score': nextProps.fixture.match_hometeam_score,
				'match_awayteam_name': nextProps.fixture.match_awayteam_name,
				'match_awayteam_score': nextProps.fixture.match_awayteam_score
			});
		}

		// Display Half-Time.
		if (this.state.match_status !== 'HT' && (nextProps.fixture.match_status === 'HT')) {
			this.displayNotification('time', {
				'goalscoringTeam': nextProps.fixture.match_awayteam_name,
				'matchTime': nextProps.fixture.match_status,
				'match_hometeam_name': nextProps.fixture.match_hometeam_name,
				'match_hometeam_score': nextProps.fixture.match_hometeam_score,
				'match_awayteam_name': nextProps.fixture.match_awayteam_name,
				'match_awayteam_score': nextProps.fixture.match_awayteam_score
			});
		}

		// Display Full-Time.
		if (this.state.match_status !== 'FT' && (nextProps.fixture.match_status === 'FT')) {
			this.displayNotification('time', {
				'goalscoringTeam': nextProps.fixture.match_awayteam_name,
				'matchTime': nextProps.fixture.match_status,
				'match_hometeam_name': nextProps.fixture.match_hometeam_name,
				'match_hometeam_score': nextProps.fixture.match_hometeam_score,
				'match_awayteam_name': nextProps.fixture.match_awayteam_name,
				'match_awayteam_score': nextProps.fixture.match_awayteam_score
			});
		}

		return true;
	}

	render() {
		const { match_hometeam_name,
						match_hometeam_score,
						match_awayteam_name,
						match_awayteam_score,
						match_status,
					  match_live } = this.state.fixture;

		const scoreClasses = classNames(
			'fixture-table__row__element --score',
			match_live === '1' && match_status !== 'FT' ? '--live' : ''
		)

		return (
			<div className={this.setMatchRowClass()} id={`match-${this.props.fixture.match_id}`}>
				<div className='fixture-table__row' onClick={(e) => this.renderMatchData(e)}>
					<div className='fixture-table__row__scoreline'>
						{match_live === '1' && match_status !== 'FT' && (
							<div className='fixture-table__row__element --checkbox'>
								<CustomCheckbox
									clickEvent={this.toggleFollowMatch}
									id={this.props.fixture.match_id}
									name={this.props.fixture.match_id} />
							</div>)
						}
						<div className='fixture-table__row__element --homeTeam'>
							<div className='fixture-table__row__red-cards'>{this.displayRedCards('home')}</div>
							<span className='fixture-table__row__scoreline__label'>{match_hometeam_name}</span>
						</div>
						<div className={scoreClasses}>
							{match_hometeam_score} - {match_awayteam_score}
							<div className='fixture-table__row__time'>{this.handleMatchTime()}</div>
						</div>
						<div className='fixture-table__row__element --awayTeam'>
							<span className='fixture-table__row__scoreline__label'>{match_awayteam_name}</span>
							<div className='fixture-table__row__red-cards'>{this.displayRedCards('away')}</div>
						</div>
					</div>
				</div>
				{match_status !== '' && (
					<FixtureData
						id={`match-${this.props.fixture.match_id}-data`}
						fixture={this.props.fixture} />
				)}
				<H2HData
					id={`match-${this.props.fixture.match_id}-H2H-data`}
					isLoading={this.state.isLoading}
					firstTeam={match_hometeam_name}
					secondTeam={match_awayteam_name}
					data={this.state.h2h_data} />
			</div>
		);
	}
}
