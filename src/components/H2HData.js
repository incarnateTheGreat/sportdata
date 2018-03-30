import React, { Component } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { ScaleLoader } from 'react-spinners';

const h2h = (e, i) => {
	const homeWinner = classNames(
		'h2h-data__first-v-second__match-info',
		e['match_hometeam_score'] > e['match_awayteam_score'] ? '--winner' : ''
	),
	awayWinner = classNames(
		'h2h-data__first-v-second__match-info',
		e['match_awayteam_score'] > e['match_hometeam_score'] ? '--winner' : ''
	);

	return (
		<div className='h2h-data__first_lastResults__row' key={i}>
			<span className='h2h-data__first-v-second__date'>{moment(e['match_date']).format('MMM D, YYYY')}</span>
			<div className='h2h-data__first-v-second__data'>
				<span className={homeWinner}>{e['match_hometeam_name']}</span>
				<span className='h2h-data__first-v-second__match-info --score'>
					{e['match_hometeam_score']} - {e['match_awayteam_score']}
				</span>
				<span className={awayWinner}>{e['match_awayteam_name']}</span>
			</div>
		</div>
	)
};

const lastResults = (team, e, i) => {
	const homeWinner = classNames(
		'h2h-data__first-v-second__match-info',
		e['match_hometeam_score'] > e['match_awayteam_score'] ? '--winner' : ''
	),
	awayWinner = classNames(
		'h2h-data__first-v-second__match-info',
		e['match_awayteam_score'] > e['match_hometeam_score'] ? '--winner' : ''
	);

	return (
		<div className='h2h-data__second_lastResults__row' key={i}>
			<span className='h2h-data__first-v-second__date'>{moment(e['match_date']).format('MMM D, YYYY')}</span>
			<div className='h2h-data__first-v-second__data'>
				<span className={homeWinner}>{e['match_hometeam_name']}</span>
				<span className='h2h-data__first-v-second__match-info --score'>
					{e['match_hometeam_score']} - {e['match_awayteam_score']}
				</span>
				<span className={awayWinner}>{e['match_awayteam_name']}</span>
			</div>
		</div>
	)
};

export default class H2HData extends Component {
	render() {
		const { id,
						isLoading,
						firstTeam,
						secondTeam,
						data } = this.props,
						numberOfPreviousMeetings = 3,
						numberOfResults = 5;

		return (
			<div id={id} className='h2h-data'>
				<div className={'loading-spinner --statistics' + (isLoading ? '' : ' --hide-loader')}>
					<ScaleLoader
						color={'#123abc'}
						loading={true}
					/>
				</div>
				{data && data.firstTeam_VS_secondTeam.length > 0 && (
					<div className='h2h-data__first-v-second'>
						<h3 className='h2h-data__title'>Last {numberOfPreviousMeetings} Meetings</h3>
						{data.firstTeam_VS_secondTeam.slice(0, numberOfPreviousMeetings).map((e, i) =>
							h2h(e, i)
						)}
					</div>
				)}
				{data && data.firstTeam_lastResults.length > 0 && (
					<div className='h2h-data__first_lastResults'>
						<h3 className='h2h-data__title'>{firstTeam} Last {numberOfResults} Results</h3>
						{data.firstTeam_lastResults.slice(0, numberOfResults).map((e, i) =>
							lastResults(firstTeam, e, i)
						)}
					</div>
				)}
				{data && data.secondTeam_lastResults.length > 0 && (
					<div className='h2h-data__second_lastResults'>
						<h3 className='h2h-data__title'>{secondTeam} Last {numberOfResults} Results</h3>
						{data.secondTeam_lastResults.slice(0, numberOfResults).map((e, i) =>
							lastResults(secondTeam, e, i)
						)}
					</div>
				)}
			</div>
		);
	}
}
