import React, { Component } from 'react';
import moment from 'moment';
import { ScaleLoader } from 'react-spinners';

const h2h = (e, i) => {
	return (
		<div className='h2h-data__first-v-second__row' key={i}>
			<span className='h2h-data__first-v-second__date'>{moment(e['match_date']).format('MMM D, YYYY')}</span>
      <div className='h2h-data__first-v-second__data'>
        <span className='h2h-data__first-v-second__match-info'>{e['match_hometeam_name']}</span>
        <span className='h2h-data__first-v-second__match-info --score'>
          {e['match_hometeam_score']} - {e['match_awayteam_score']}
        </span>
        <span className='h2h-data__first-v-second__match-info'>{e['match_awayteam_name']}</span>
      </div>
		</div>
	)
};

export default class H2HData extends Component {
	render() {
    const { id,
            isLoading,
            data } = this.props;

    if (data) {
      console.log(data);
      // firstTeam_VS_secondTeam
      // firstTeam_lastResults
      // secondTeam_lastResults
    }

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
            <h3 className='h2h-data__title'>Last 3 Meetings</h3>
            {data.firstTeam_VS_secondTeam.map((e, i) =>
              h2h(e, i)
            )}
          </div>
        )}
			</div>
		);
	}
}
