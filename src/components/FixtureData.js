import React, { Component } from 'react';
import _ from 'lodash';

const goalscorer = (e, i) => {
	return (
		<div className='fixture-data__events__row' key={i}>
			<span className='fixture-data__events__row__event'>
				{e['home_scorer'] !== '' ? <span className='goalscorer'>{e['home_scorer']}</span> : ''}
				{e['home_scorer'] !== '' ? <span className='icon goal'></span> : ''}
			</span>
			<span className='fixture-data__events__row__event --time'>{e.time}</span>
			<span className='fixture-data__events__row__event'>
				{e['away_scorer'] !== '' ? <span className='icon goal'></span> : ''}
				{e['away_scorer'] !== '' ? <span className='goalscorer'>{e['away_scorer']}</span> : ''}
			</span>
		</div>
	)
};

const booking = (e, i) => {
	return (
		<div className='fixture-data__events__row' key={i}>
			<span className='fixture-data__events__row__event'>
				{e['home_fault'] !== '' ? <span className='booked-player'>{e['home_fault']}</span> : ''}
				{e['home_fault'] !== '' && e['card'] === 'yellowcard' ? <span className='icon yellow-card'></span> : ''}
				{e['home_fault'] !== '' && e['card'] === 'yellow-red' ? <span className='icon yellow-red-card'></span> : ''}
				{e['home_fault'] !== '' && e['card'] === 'redcard' ? <span className='icon red-card'></span> : ''}
			</span>
			<span className='fixture-data__events__row__event --time'>{e.time}</span>
			<span className='fixture-data__events__row__event'>
				{e['away_fault'] && e['card'] === 'yellowcard' ? <span className='icon yellow-card'></span> : ''}
				{e['away_fault'] && e['card'] === 'yellow-red' ? <span className='icon yellow-red-card'></span> : ''}
				{e['away_fault'] && e['card'] === 'redcard' ? <span className='icon red-card'></span> : ''}
				{e['away_fault'] !== '' ? <span className='booked-player'>{e['away_fault']}</span> : ''}
			</span>
		</div>
	)
};

const statistic = (e, i) => {
	return (
		<div className='fixture-data__statistics__row' key={i}>
			<span className='fixture-data__statistics__row__event'>{e['home']}</span>
			<span className='fixture-data__statistics__row__event --type'>{e['type']}</span>
			<span className='fixture-data__statistics__row__event'>{e['away']}</span>
		</div>
	)
};

const NoDataMsg = (fixture) => {
	if (fixture.match_status === 'FT') {
		return (
			<div className='fixture-data__statistics'>
				<span className='fixture-data__statistics__no-data'>Sorry. There is no statistical data for this match.</span>
			</div>
		)
	} else {
		return (<div></div>)
	}
};

export default class FixtureData extends Component {
	refineDoubleBooking(cardsGoalScorers) {
		const bookings = cardsGoalScorers.filter(record => record['card'] !== undefined),
					redCardPlayer = bookings.find(player => player['card'] === 'redcard');

		if (redCardPlayer) {
			// Get Player Name and use it to find duplicates in the loop below.
			const redCardPlayerName = redCardPlayer['home_fault'] || redCardPlayer['away_fault'];

			// TODO: Keep this for now. Might need it later?
			// Looks for multiple instances of Yellow Cards for the Red-Carded Player.
			// const b = _.filter(bookings, (o) => {
			// 	if ((o['away_fault'] === redCardPlayerName || o['home_fault'] === redCardPlayerName) &&
			// 			o['card'] === 'yellowcard') {
			// 		return o
			// 	}
			// }).length;

			// If the Red-Carded Player had accumlated 2 Yellow Cards, then find the 2nd
			// Yellow Card and the Red Card and swap them out for the hybrod Yellow/Red.
			const yellowIndex = _.findLastIndex(cardsGoalScorers, (player) => {
				return ((player['home_fault'] === redCardPlayerName || player['away_fault'] === redCardPlayerName)
								&& player['card'] === 'yellowcard')
			});

			const redIndex = _.findLastIndex(cardsGoalScorers, (player) => {
				return ((player['home_fault'] === redCardPlayerName || player['away_fault'] === redCardPlayerName)
								&& player['card'] === 'redcard')
			});

			// console.log(redCardPlayer, cardsGoalScorers, yellowIndex);

			// If yellowIndex returns undefined, then ignore it. Otherwise,
			// replace the second Yellow Card with 'yellow-red' and
			// remove the related Red Card.
			// if (yellowIndex !== -1) {
			// 	cardsGoalScorers[yellowIndex]['card'] = 'yellow-red';
			// 	cardsGoalScorers.splice(redIndex, 1);
			// }
		}
	}

	refineGameData() {
		const { fixture } = this.props;
		let cardsGoalScorers = [];

		// Combine both Cards and Goal Scorers into one Array.
		for (let x in fixture.cards) cardsGoalScorers.push(fixture.cards[x]);
		for (let x in fixture.goalscorer) cardsGoalScorers.push(fixture.goalscorer[x])

		// Temporarily remove the single-quote tick from the Time attribute for proper sorting.
		cardsGoalScorers.forEach(el => el.time = el.time.replace("'", ""));

		// Delete the empty Time element from the array.
		cardsGoalScorers = cardsGoalScorers.filter(e => e.time !== "" ? e : null)

		// Sort the new Array by Time ASC.
		cardsGoalScorers.sort((a, b) => a.time - b.time);

		// Replace the single-quote tick back into the Time attribute.
		cardsGoalScorers.forEach(el => el.time = `${el.time}'`);

		return cardsGoalScorers;
	}

	render() {
		const { id,
						fixture } = this.props;

		// Refine the Game Data.
		const cardsGoalScorers = this.refineGameData();

		// If a player has a Second Yellow Card, remove it and the following Red Card
		// and replace it with a Yellow-Red Card.
		this.refineDoubleBooking(cardsGoalScorers);

		return (
			<div id={id} className='fixture-data'>
				{cardsGoalScorers.length > 0 && (
					<div className='fixture-data__events'>
						<span className='fixture-data__statistics__title'>Match Summary</span>
						{cardsGoalScorers.map((e, i) =>
							e.hasOwnProperty('home_scorer') ? goalscorer(e, i) : booking(e, i)
						)}
					</div>
				)}
				{fixture.statistics.length > 0 ? (
					<div className='fixture-data__statistics'>
						<span className='fixture-data__statistics__title'>Match Stats</span>
						{fixture.statistics.map((e, i) =>
							statistic(e, i)
						)}
					</div>
				) : (
					<NoDataMsg {...fixture} />
				)}
			</div>
		);
	}
}
