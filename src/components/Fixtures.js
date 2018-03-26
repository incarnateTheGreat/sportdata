import React, { Component } from 'react';
import Fixture from './Fixture';
import axios from 'axios';
import moment from 'moment';
import * as constants from '../constants';

export default class Fixtures extends Component {
	constructor(props) {
		super();

		this.state = {
			teamLogo: '',
			teamSchedule: null,
			fixtures: []
		}

		this.getTeamData = this.getTeamData.bind(this);
		this.getTeamSchedule = this.getTeamSchedule.bind(this);
	}

	getTeamData() {
		const url = `https://www.thesportsdb.com/api/v1/json/1/searchteams.php`;

		axios.get(`${url}?t=Manchester_City`)
      .then(res => {
				const team = res.data.teams[0];

				console.log(team);

				this.setState({
					teamLogo: team.strTeamBadge,
					teamName: team.strAlternate
				})
      })
	}

	getTeamSchedule() {
		const url = `https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id=133613`;

		axios.get(`${url}`)
      .then(res => {
				this.setState({
					teamSchedule: res.data.events
				}, () => {
					console.log(this.state);
				})
      })
	}

	getNextFiveDays() {
		const from = moment().subtract(10, 'day').format('YYYY-MM-DD'),
					to = moment().add(10, 'day').format('YYYY-MM-DD');

		return { from, to }
	}

	getFixtures() {
		const { from, to } = this.getNextFiveDays(),
					url = `https://apifootball.com/api/?action=get_events&match_live=1&from=${from}&to=${to}&league_id=63&APIkey=${constants.API_FOOTBALL}`;
		let tempArr = [],
				fixtures = []

		// Return Fixture Data and group by date.
		this.getData(url).then(data => {
			tempArr = data.data.reduce((r, a) => {
				r[a.match_date] = r[a.match_date] || [];
				r[a.match_date].push(a);
				return r;
			}, []);

			// In order to loop through the array, we will push the objects into an array format.
			for(let x in tempArr) fixtures.push(tempArr[x]);

			// Make today's or the most current fixtures listed first.
			fixtures.reverse();

			// Apply into the State.
			this.setState({ fixtures });
		});
	}

	async getData(url) {
		return await axios(url);
	}

	componentDidMount() {
		this.getFixtures();
	}

  render() {
		return (
			<section className='fixtures'>
				<div className='teamData'>
					<button type='button' value='' onClick={this.getTeamData}>Get Team Data</button>
					<button type='button' value='' onClick={this.getTeamSchedule}>Get Team Schedule</button>
					<h2>{this.state.teamName}</h2>
					<img src={this.state.teamLogo} alt=''/>
					{this.state.teamSchedule ? (
						<table>
							<tbody>
							{this.state.teamSchedule.map((row, i) =>
								<tr key={i}>
									<td>{row.strEvent}</td>
									<td className='dataCol'>{row.dateEvent}</td>
									<td className='dataCol'>{row.strTime}</td>
								</tr>
							)}
							</tbody>
						</table>
					) : ''}
				</div>
				{this.state.fixtures.map((fixture, i) =>
					<div className='fixture-table' key={i}>
						<div className='fixture-table__row date'>
							<div>{moment(fixture[0].match_date).format('MMMM DD, YYYY')}</div>
						</div>
						{fixture.map((e, j) => <Fixture fixture={e} key={j} />)}
					</div>
				)}
			</section>
		)
  }
}
