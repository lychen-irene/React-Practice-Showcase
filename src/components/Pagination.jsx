const Pagination = function ({ pagination, onChange }) {
  const handleClick = function (e, page) {
    e.preventDefault()
    onChange(page)
  }
  return (

    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className="page-item">
            <a
              className={`page-link ${!pagination.has_pre
                ? 'disabled bg-primary border-primary text-secondary'
                : 'bg-primary border-primary text-light'}`}
              href="#"
              aria-label="Previous"
              onClick={e => handleClick(e, pagination.current_page - 1)}
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {
            Array.from({ length: pagination.total_pages }, (_, index) => (
              <li className="page-item" key={index}>
                <a
                  className={`page-link ${pagination.current_page === index + 1
                    ? 'active bg-primary border-primary fw-bold text-light'
                    : 'bg-primary border-primary text-light'}`}
                  href="#"
                  onClick={e => handleClick(e, index + 1)}
                >
                  {index + 1}
                </a>
              </li>
            ))
          }

          <li className="page-item">
            <a
              className={`page-link ${!pagination.has_next
                ? 'disabled bg-primary border-primary text-secondary'
                : 'bg-primary border-primary text-light'}`}
              href="#"
              aria-label="Next"
              onClick={e => handleClick(e, pagination.current_page + 1)}
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default Pagination
