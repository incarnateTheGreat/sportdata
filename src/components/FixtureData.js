import React, { Component } from 'react';

export default class FixtureData extends Component {
	render() {
		const { id, fixture } = this.props;

		return (
			<div id={id} className='fixture-data'>
				<div className='fixture-data__header'>
					<span className='fixture-data__header__team'>{fixture.match_hometeam_name}</span>
					<span className='fixture-data__score'>{fixture.match_hometeam_score} - {fixture.match_awayteam_score}</span>
					<span className='fixture-data__header__team'>{fixture.match_awayteam_name}</span>
				</div>
				<div className='fixture-data__events'>
					{fixture.goalscorer.map((e, i) =>
						<div className='fixture-data__events__row' key={i}>
							<span className='fixture-data__events__row__event'>{e.home_scorer !== '' ? e.home_scorer : e.away_scorer}</span>
							<span className='fixture-data__events__row__time'>{e.time}</span>
							<span className='fixture-data__events__row__event'>{e.home_scorer !== '' ? e.home_scorer : e.away_scorer}</span>
						</div>
					)}
				</div>
			</div>
		);
	}
}
