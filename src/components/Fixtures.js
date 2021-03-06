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
				 updateEndSearchDate,
			 	 updateLeagueSelection } from '../actions/index';

class Fixtures extends Component {
	constructor(props) {
		super();

		this.state = {
			fixtures: [],
			h2h_list: [],
			startDate: moment().subtract(1, 'day'),
			endDate: moment(),
			isLoading: false
		};

		this.interval = null;
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

			// Stop the Timer to prevent it from firing when there's no live data.
			if (this.interval) {
				this.stopTimerInterval();
			}

			this.getFixtures();
		})
	}

	getLeague(id) {
		const league_id = id.target.value;

		store.dispatch(updateLeagueSelection(league_id));

		// Update the State with the most-recently selected League.
		// Stop the Timer to prevent it from firing when there's no live data.
		if (this.interval) {
			this.stopTimerInterval();
		}

		this.getFixtures();
	}

	getFixtures() {
		// Prevent Fixture Loading Spinner from rendering on default load.
		if (this.state.fixtures.length > 0) this.setState({ isLoading: true });

		const format = 'YYYY-MM-DD',
					{ from, to } = this.getDateRange(),
					league_id = store.getState(updateLeagueSelection).leagueSelection || Object.keys(LEAGUE_IDS)[0],
					cacheTimestamp = new Date().getTime(),
					url = `https://apifootball.com/api/?action=get_events&match_live=1&from=${from.format(format)}&to=${to.format(format)}&league_id=${league_id}&APIkey=${API_FOOTBALL}&timestamp=${cacheTimestamp}`,
					stateObj = { isLoading: false, startDate: from, endDate: to };
		let dataArr = [],
				fixtures = [];

		// Return Fixture Data and group by date.
		this.getData(url).then(data => {
			stateObj['fixtures'] = fixtures;

			if (data.data.error !== 404) {
				dataArr = data.data.reduce((r, a) => {
					r[a.match_date] = r[a.match_date] || [];
					r[a.match_date].push(a);
					return r;
				}, []);

				if (Object.keys(dataArr).length > 0) {
					// In order to loop through the array, we will push the objects into an array format.
					for(let x in dataArr) fixtures.push(dataArr[x]);

					// Find and determine if Matches are Live today and if they have not been completed (or have yet to start).
					for (let x in dataArr) {
						for (let y = 0; y < dataArr[x].length; y++) {
							if (dataArr[x][y]['match_live'] === '1' &&
								 (dataArr[x][y]['match_status'] !== 'Post.' && dataArr[x][y]['match_status'] !== 'FT' && dataArr[x][y]['match_status'] !== 'Canc.')) {
								if (!this.interval) {
									this.startInterval();
								}
								break;
							}
						}
					}

					// Apply into the State.
					this.setState(stateObj, () => {
						store.dispatch(isLoading(false));
					});
				}
			} else {
				this.setState(stateObj, () => {
					store.dispatch(isLoading(false));
				})
			}
		}).catch(err => {
			this.setState(stateObj, () => {
				console.log('err:', err);
				store.dispatch(isLoading(false));
			})
		});
	}

	async getData(url) {
		store.dispatch(isLoading(true));
		return await axios(url);
	}

	startInterval() {
		this.interval = setInterval(() => {
			this.getFixtures();
		}, 60000);
	}

	leagueDropdown() {
		const leagueSelections = [];

		for (let x in LEAGUE_IDS) {
			leagueSelections.push(<option key={LEAGUE_IDS[x]} value={x}>{LEAGUE_IDS[x]}</option>)
		}

		return leagueSelections;
	}

	stopTimerInterval() {
		clearInterval(this.interval);
	}

	componentDidMount() {
		// Set League ID in State by default if not selected.
		if (!store.getState(updateLeagueSelection).leagueSelection) {
			store.dispatch(updateLeagueSelection(Object.keys(LEAGUE_IDS)[0]));
		} else {
			this.setCurrentSelectedLeague();
		}

		this.getFixtures();
	}

	setCurrentSelectedLeague() {
		const sel = document.getElementById('date-pickers__select');

		for (let i = 0, j = sel.options.length; i < j; i++) {
			if (sel.options[i].value === store.getState(updateLeagueSelection).leagueSelection) {
				sel.selectedIndex = i;
				break;
			}
		}
	}

	renderFixtures() {
		return this.state.fixtures.map((fixture, i) =>
			<div className='fixture-table' key={i}>
				<div className='fixture-table__row date'>
					<div>{moment(fixture[0].match_date).format('MMMM D, YYYY')}</div>
				</div>
				{fixture.map((e, j) => <Fixture fixture={e} key={j} />)}
			</div>
		);
	}

	componentWillUnmount() {
		this.stopTimerInterval();
	}

	render() {
		return (
			<section className='fixtures'>
				<div className='date-pickers'>
					<div className='date-pickers__container date-pickers__league'>
						<label className='date-pickers__label' htmlFor="date-pickers__select">League:</label>
						<select name='date-pickers__select' id='date-pickers__select' onChange={this.getLeague}>
							{this.leagueDropdown()}
						</select>
					</div>

					<div className='date-pickers__dates'>
						<div className='date-pickers__container'>
							<label className='date-pickers__label' htmlFor='date-pickers__start-label'>Start:</label>
							<DatePicker
								readOnly={true}
								name='date-pickers__start-label'
								id='date-pickers__start-label'
								dateFormat='LL'
								selected={this.state.startDate}
								selectsStart
								showMonthDropdown
								startDate={this.state.startDate}
								endDate={this.state.endDate}
								onChange={this.handleChangeStart} />
						</div>
						<div className='date-pickers__container'>
							<label className='date-pickers__label' htmlFor="date-pickers__end-label">End:</label>
							<DatePicker
								readOnly={true}
								name='date-pickers__end-label'
								id='date-pickers__end-label'
								dateFormat='LL'
								selected={this.state.endDate}
								selectsEnd
								showMonthDropdown
								startDate={this.state.startDate}
								endDate={this.state.endDate}
								onChange={this.handleChangeEnd} />
						</div>
					</div>
				</div>

				{this.state.fixtures.length > 0
					? this.renderFixtures()
					: (<div>Sorry. There is no match data available based on your search criteria.</div>)
				}
			</section>
		)
  }
}

const mapStateToProps = (state) => ({ isLoading: state.isLoading });

export default connect(mapStateToProps)(Fixtures);
