import React, { Component } from 'react';

export default class FixtureData extends Component {
	render() {
		const { id, fixture } = this.props;

		return (
			<div id={id} className='fixture-data'>
				<div className='fixture-data__events'>
					{fixture.goalscorer.map((e, i) =>
						<div className='fixture-data__events__row' key={i}>
							<span className='fixture-data__events__row__event'>{e.home_scorer !== '' ? e.home_scorer : ''}</span>
							<span className='fixture-data__events__row__event'>{e.time}</span>
							<span className='fixture-data__events__row__event'>{e.away_scorer !== '' ? e.away_scorer : ''}</span>
						</div>
					)}
				</div>
			</div>
		);
	}
}
