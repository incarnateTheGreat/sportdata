import React, { Component } from 'react';
import FixtureData from './FixtureData';
import classNames from 'classnames';
import moment from 'moment';
import 'moment-timezone';

export default class Fixture extends Component {
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
					allDataElems = document.querySelectorAll('.fixture-data');

		if (nodeElem.classList.contains('--active')) {
			nodeElem.classList.remove('--active');
		} else {
			// Close all Fixture Data Drawers. This also allows for toggling.
			allDataElems.forEach(elem => elem.classList.remove('--active'));

			console.log(this.props.fixture);

			nodeElem.classList.add('--active');
		}
	}

	setMatchRowClass() {
		const fixture = this.props.fixture,
					disabled = (fixture.match_status === "Postp."
											|| fixture.match_live === "0"
											|| (fixture.match_awayteam_score === "?" && fixture.match_hometeam_score === "?"));

		return classNames(
			'fixture-table__row',
			disabled ? 'fixture-table__row--disabled' : null
		);
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
						<span>{match_awayteam_name}</span>
						<div className='fixture-table__row__red-cards'>{this.displayRedCards('away')}</div>
					</div>
				</div>
				<FixtureData id={`match-${this.props.fixture.match_id}-data`} fixture={this.props.fixture} />
			</div>
		);
	}
}
