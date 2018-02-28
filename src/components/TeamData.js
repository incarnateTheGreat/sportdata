import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import * as constants from '../constants';

export default class SearchFlight extends Component {
	constructor(props) {
		super();

		this.state = {
			teamLogo: '',
			teamSchedule: null,
			fixtures: null
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

		this.getData(url).then(data => {
			console.log(data.data);
			this.setState({
				fixtures: data.data
			})
		});
	}

	async getData(url) {
		return await axios(url);
	}

  render() {
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

				<div>
					<button type='button' value='' onClick={this.getFixtures}>Get Fixtures</button>
					{this.state.fixtures ? (
						<table>
							<tbody>
							{this.state.fixtures.map((row, i) =>
								<tr key={i}>
									<td>{row.match_date}</td>
									<td>{row.match_hometeam_name}</td>
									<td>{row.match_awayteam_name}</td>
									<td>{row.match_time}</td>
								</tr>
							)}
							</tbody>
						</table>
					) : ''}
				</div>

			</div>
		)
  }
}
