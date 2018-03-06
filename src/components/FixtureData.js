import React, { Component } from 'react';

export default class FixtureData extends Component {
	render() {
		const { id, fixture } = this.props;

		return (
			<div id={id} className='fixture-data'>
				<h2>
					<span>{fixture.match_hometeam_name}</span>
					<span className='fixture-data__score'>{fixture.match_hometeam_score} - {fixture.match_awayteam_score}</span>
					<span>{fixture.match_awayteam_name}</span>
				</h2>
				<div className='fixture-data__goal-scorers'>
					{fixture.goalscorer.map((e, i) => {
						return <div key={i}>
								<span className='fixture-data__goal-scorers__time'>{e.time}</span>
								<span className='fixture-data__goal-scorers__goal-scorer'>{e.home_scorer !== '' ? e.home_scorer : e.away_scorer}</span>
							</div>
					})}
				</div>
			</div>
		);
	}
}
