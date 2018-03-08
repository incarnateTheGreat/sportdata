import React, { Component } from 'react';

const goalscorer = (e, i) => {
	return (
		<div className='fixture-data__events__row' key={i}>
			<span className='fixture-data__events__row__event'>
				{e['home_scorer'] !== '' ? <span className='goalscorer'>{e['home_scorer']}</span> : ''}
				{e['home_scorer'] !== '' ? <span className='icon goal'></span> : ''}
			</span>
			<span className='fixture-data__events__row__event'>{e.time}</span>
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
			</span>
			<span className='fixture-data__events__row__event'>{e.time}</span>
			<span className='fixture-data__events__row__event'>
				{e['away_fault'] && e['card'] === 'yellowcard' ? <span className='icon yellow-card'></span> : ''}
				{e['away_fault'] !== '' ? <span className='booked-player'>{e['away_fault']}</span> : ''}
			</span>
		</div>
	)
};

export default class FixtureData extends Component {
	render() {
		const { id, fixture } = this.props,
					cardsGoalScorers = [];

		// Combine both Cards and Goal Scorers into one Array.
		for (let x in fixture.cards) cardsGoalScorers.push(fixture.cards[x]);
		for (let x in fixture.goalscorer) cardsGoalScorers.push(fixture.goalscorer[x])

		// Sort the new Array by Time ASC.
		cardsGoalScorers.sort((a,b) => a.time > b.time);

		// console.log(cardsGoalScorers);

		return (
			<div id={id} className='fixture-data'>
				<div className='fixture-data__events'>
					{cardsGoalScorers.map((e, i) =>
						e.hasOwnProperty('home_scorer') ? goalscorer(e, i) : booking(e, i)
					)}
				</div>
			</div>
		);
	}
}
