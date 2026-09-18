type RatingStarsProps = {
  rating: number;
  className?: string;
};

const RatingStars = ({ rating, className = "" }: RatingStarsProps) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (rating >= star) {
          return (
            <i
              key={star}
              className="fa-solid fa-star text-yellow-500"
            ></i>
          );
        }

        if (rating >= star - 0.5) {
          return (
            <i
              key={star}
              className="fa-solid fa-star-half-stroke text-yellow-500"
            ></i>
          );
        }

        return (
          <i
            key={star}
            className="fa-regular fa-star text-yellow-500"
          ></i>
        );
      })}
    </div>
  );
};

export default RatingStars;