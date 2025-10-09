import React from 'react';

const AcceptReject = () => {
    const handleAccept = () => {
        // Logic to accept the order
    };

    const handleReject = () => {
        // Logic to reject the order
    };

    return (
        <div>
            <h2>Accept or Reject Order</h2>
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleReject}>Reject</button>
        </div>
    );
};

export default AcceptReject;