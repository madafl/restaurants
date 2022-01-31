import React from 'react';

 const Pagination = ({itemsPerPage, itemsLength, handleClick, active, page}) => {
    const pageNumbers = [];

    for (let i=1;i<=Math.ceil(itemsLength / itemsPerPage); i++){
        pageNumbers.push(i);
    }
    
    return (
        <div className="pagination-diy">
        <ul>
            <a onClick={(e) => { if (page===1) {(e.preventDefault())} else {handleClick(page-1)}}}>&laquo; Inapoi</a>
            {pageNumbers.map(number => (
            <li onClick={() => handleClick(number)} key={number} className= {active === number ? "selected " : ""}>
                {number}
            </li>
            ))}
            <a onClick={(e) => { if (page===pageNumbers.at(-1)) {(e.preventDefault())} else {handleClick(page+1)}}}> Inainte &raquo;</a>
      </ul>
    </div>
    )
}

export default Pagination;