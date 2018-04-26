import React, { Component } from 'react';
import Fixture from './Fixture';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { API_FOOTBALL, LEAGUE_IDS } from '../constants/constants';

// Redux
import { connect } from 'react-redux';
import store from '../store/index';
import { isLoading,
				 updateStartSearchDate,
				 updateEndSearchDate } from '../actions/index';

class Fixtures extends Component {
	constructor(props) {
		super();

		this.state = {
			fixtures: [],
			h2h_list: [],
			startDate: moment().subtract(10, 'day'),
			endDate: moment().add(5, 'day'),
			isLoading: false,
			league_id: 128
		};

		this.handleChangeStart = this.handleChangeStart.bind(this);
		this.handleChangeEnd = this.handleChangeEnd.bind(this);
		this.getLeague = this.getLeague.bind(this);
	}

	getDateRange() {
		const from = store.getState(updateStartSearchDate).startDate || this.state.startDate,
				to = store.getState(updateEndSearchDate).endDate || this.state.endDate;

		return { from, to };
	}

	handleChangeStart(startDate) {
		this.handleChange({ startDate })
	}

  handleChangeEnd(endDate) {
		this.handleChange({ endDate })
	}

	handleChange({startDate, endDate}) {
		startDate = startDate || this.state.startDate
		endDate = endDate || this.state.endDate

		if (startDate.isAfter(endDate)) {
			endDate = startDate
		}

		this.setState({ startDate, endDate }, () => {
			store.dispatch(updateStartSearchDate(startDate));
			store.dispatch(updateEndSearchDate(endDate));
			this.getFixtures();
		})
	}

	getLeague(id) {
		const league_id = id.target.value;

		// Update the State with the most-recently selected League.
		this.setState({ league_id }, () => {
			this.getFixtures();
		});
	}

	getFixtures() {
		// Prevent Fixture Loading Spinner from rendering on default load.
		if (this.state.fixtures.length > 0) {
			this.setState({ isLoading: true });
		}

		// Set League ID in State by default if not selected.
		if (!this.state.league_id) {
			this.setState({ league_id: Object.keys(LEAGUE_IDS)[0] });
		}

		const format = 'YYYY-MM-DD',
					{ from, to } = this.getDateRange(),
					league_id = this.state.league_id,
					url = `https://apifootball.com/api/?action=get_events&match_live=1&from=${from.format(format)}&to=${to.format(format)}&league_id=${league_id}&APIkey=${API_FOOTBALL}`;
		let dataArr = [],
				fixtures = [];

		// Return Fixture Data and group by date.
		this.getData(url).then(data => {
			if (data.data.error !== 404) {
				dataArr = data.data.reduce((r, a) => {
					r[a.match_date] = r[a.match_date] || [];
					r[a.match_date].push(a);
					return r;
				}, []);

				if (Object.keys(dataArr).length > 0) {
					// In order to loop through the array, we will push the objects into an array format.
					for(let x in dataArr) fixtures.push(dataArr[x]);

					// Make today's or the most current fixtures listed first.
					// fixtures.reverse();

					// Apply into the State.
					this.setState({ fixtures, isLoading: false, startDate: from, endDate: to }, () => {
						store.dispatch(isLoading(false));
					});
				}
			} else {
				this.setState({ fixtures, isLoading: false, startDate: from, endDate: to }, () => {
					store.dispatch(isLoading(false));
				})
			}
		});
	}

	async getData(url) {
		store.dispatch(isLoading(true));
		return await axios(url);
	}

	componentDidMount() {
		this.getFixtures();
	}

	leagueDropdown() {
		const leagueSelections = [];

		for (let x in LEAGUE_IDS) {
			leagueSelections.push(<option key={LEAGUE_IDS[x]} value={x}>{LEAGUE_IDS[x]}</option>)
		}

		return leagueSelections;
	}

  render() {
		return (
			<section className='fixtures'>
				<div className='date-pickers'>
					<div className='date-pickers__container'>
						<span className='date-pickers__label'>League:</span>
						<select onChange={this.getLeague}>
							{this.leagueDropdown()}
						</select>
					</div>

					<div className='date-pickers__container'>
						<span className='date-pickers__label'>Start:</span>
						<DatePicker
							dateFormat='LL'
							selected={this.state.startDate}
							selectsStart
							showMonthDropdown
							startDate={this.state.startDate}
							endDate={this.state.endDate}
							onChange={this.handleChangeStart} />
					</div>

					<div className='date-pickers__container'>
						<span className='date-pickers__label'>End:</span>
						<DatePicker
							dateFormat='LL'
							selected={this.state.endDate}
							selectsEnd
							showMonthDropdown
							startDate={this.state.startDate}
							endDate={this.state.endDate}
							onChange={this.handleChangeEnd} />
					</div>
				</div>

				{this.state.fixtures.length > 0 ? this.state.fixtures.map((fixture, i) =>
					<div className='fixture-table' key={i}>
						<div className='fixture-table__row date'>
							<div>{moment(fixture[0].match_date).format('MMMM DD, YYYY')}</div>
						</div>
						{fixture.map((e, j) => <Fixture fixture={e} key={j} />)}
					</div>
				) : (
					<div>Sorry. There is no match data available based on your search criteria.</div>
				)}
			</section>
		)
  }
}

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

export default connect(mapStateToProps)(Fixtures);
