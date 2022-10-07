import React from 'react';

function Square({handleChooseSquare, val}) {
    return (
        <div className='square' onClick={handleChooseSquare}>
            {val}
        </div>
    );
}

export default Square;