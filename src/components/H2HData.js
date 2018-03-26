import React, { Component } from 'react';
import { ScaleLoader } from 'react-spinners';

const statistic = (e, i) => {
	return (
		<div className='fixture-data__statistics__row' key={i}>
			<span className='fixture-data__statistics__row__event'>{e['home']}</span>
			<span className='fixture-data__statistics__row__event --type'>{e['type']}</span>
			<span className='fixture-data__statistics__row__event'>{e['away']}</span>
		</div>
	)
};

export default class H2HData extends Component {
	render() {
    const { id,
            isLoading,
            data } = this.props;

    if (data) {
      const { last_three_matches,
              firstTeam_lastResults,
              secondTeam_lastResults } = data;
    }

		return (
			<div id={id} className='h2h-data'>
				<div className={'loading-spinner --statistics' + (isLoading ? '' : ' --hide-loader')}>
					<ScaleLoader
						color={'#123abc'}
						loading={true}
					/>
				</div>
        {data && (
          <div>Head-to-Head Stats</div>
        )}
			</div>
		);
	}
}
