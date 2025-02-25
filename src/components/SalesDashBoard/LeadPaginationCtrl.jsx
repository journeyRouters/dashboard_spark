/* eslint-disable react/prop-types */
const activitiesPerPage = 10;
const LeadPaginationCtrl = ({
  currentPage,
  setCurrentPage,
  totalActivities,
}) => {
  const handleNext = () => {
    if ((currentPage + 1) * activitiesPerPage < totalActivities) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div
      className="pagination-controls"
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div
        onClick={handlePrevious}
        style={{
          background: currentPage === 0 ? "gray" : "green",
          padding: "1rem",
          color: "white",
          cursor: "pointer",
        }}
      >
        Previous
      </div>
      <div
        onClick={handleNext}
        style={{
          background:
            (currentPage + 1) * activitiesPerPage >= totalActivities
              ? "gray"
              : "green",
          padding: "1rem",
          color: "white",
          cursor: "pointer",
        }}
      >
        Next
      </div>
    </div>
  );
};

export default LeadPaginationCtrl;
