import React, { Component } from 'react';
import Fixture from './Fixture';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import * as constants from '../constants';

export default class SearchFlight extends Component {
	constructor(props) {
		super();

		this.state = {
			teamLogo: '',
			teamSchedule: null,
			fixtures: []
		}

		this.getTeamData = this.getTeamData.bind(this);
		this.getTeamSchedule = this.getTeamSchedule.bind(this);
		this.getFixtures = this.getFixtures.bind(this);
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
		const today = moment().format('YYYY-MM-DD'),
					nextFiveDays = moment().add(5, 'day').format('YYYY-MM-DD');

		return { today, nextFiveDays }
	}

	getFixtures() {
		const { today, nextFiveDays } = this.getNextFiveDays(),
					url = `https://apifootball.com/api/?action=get_events&from=${today}&to=${nextFiveDays}&league_id=63&APIkey=${constants.API_FOOTBALL}`;
		let tempArr = [],
				fixtures = []

		// Return Fixture Data and group by date.
		this.getData(url).then(data => {
			tempArr = data.data.reduce((r, a) => {
				r[a.match_date] = r[a.match_date] || [];
				r[a.match_date].push(a);
				return r;
			}, []);

			// fixtures = _.groupBy(data.data, o => {
			// 	return o.match_date;
			// });
			//
			// fixtures = [fixtures];

			for(let x in tempArr) {
				fixtures.push(tempArr[x])
			}

			// console.log(fixtures);

			this.setState({ fixtures }, () => {
				// for (let val in this.state.fixtures) {
				// 	console.log(val);
				// 	this.state.fixtures[val].map((e, i) => {
				// 		console.log(e);
				// 	})
				// }
			})
		});
	}

	async getData(url) {
		return await axios(url);
	}

  render() {


		// const fixtureItems = this.state.fixtures ? this.state.fixtures.map((fixture, i) => <Fixtures fixture={fixture} key={i} />) : null

		return (
			<div className='mainBody'>
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

				<div className='fixtures'>
					<button type='button' value='' onClick={this.getFixtures}>Get Fixtures</button>
					<div>
						{this.state.fixtures ? (
							<table>
								<tbody>
									{this.state.fixtures.map((fixture, i) => <Fixture fixture={fixture} key={i} />)}
								</tbody>
							</table>
						) : ''}
					</div>
				</div>
			</div>
		)
  }
}
