import React, { useState, useEffect } from 'react';
import moment from 'moment';

const TimeSince = ({ time }) => {
  const [timeSince, setTimeSince] = useState('');

  useEffect(() => {
    const updateTimeSince = () => {
      const newTimeSince = moment(time).fromNow();
      setTimeSince(newTimeSince);
    };

    updateTimeSince();

    const intervalId = setInterval(updateTimeSince, 6000); // Update every minute

    return () => clearInterval(intervalId);
  }, [time]);

  return (
    <span className='text-xs text-gray-500'>{timeSince}</span>
  );
};

export default TimeSince;