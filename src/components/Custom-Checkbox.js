import React, { Component } from 'react';

export default class CustomCheckbox extends Component {
  render() {
    const { id,
            name,
            value,
            clickEvent } = this.props;

    return (
      <label className='custom-checkbox-container'>
        <input type='checkbox'
          onClick={clickEvent}
          id={id}
          name={name}
          value={value} />
        <span className='checkmark'></span>
      </label>
    )
  }
}
