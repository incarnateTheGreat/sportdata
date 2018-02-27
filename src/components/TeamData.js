import React, { Component } from 'react';
import axios from 'axios';

export default class SearchFlight extends Component {
	constructor(props) {
		super();

		this.state = {
			teamLogo: '',
			teamSchedule: null
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

  render() {
		return (
			<div>
				<button type="button" value="" onClick={this.getTeamData}>Get Team Data</button>
				<button type="button" value="" onClick={this.getTeamSchedule}>Get Team Schedule</button>
				<h2>{this.state.teamName}</h2>
				<img src={this.state.teamLogo} alt=""/>

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
		)
  }
}
