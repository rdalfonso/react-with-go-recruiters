import React from 'react';

const Review = ({ review }) => {
  const reviewSplit = review.split('|');
  console.log('reviewSplit', reviewSplit)
  
  return (
   <div>
      <span className="badge bg-secondary me-1">
      {reviewSplit[0]}
     </span>
     <div>
     {reviewSplit[1]}
     </div>
   </div>
  )
};

export default Review;