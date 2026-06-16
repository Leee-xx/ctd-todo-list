import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function SortBy({ sortBy, sortDirection, onSortByChange, onSortDirectionChange }) {
  return(
    <Container>
      <Row>
        <Col>
          <label htmlFor='sortBy'>Sort By</label>
          <select id='sortBy' value={sortBy} onChange={(e) => onSortByChange(e.target.value)}>
            <option value='createdAt'>Creation Date</option>
            <option value='title'>Title</option>
          </select>
        </Col>
        <Col>
          <label htmlFor='sortDirection'>Order</label>
          <select id='sortDirection' value={sortDirection} onChange={(e) => onSortDirectionChange(e.target.value)}>
            <option value='desc'>Descending</option>
            <option value='asc'>Ascending</option>
          </select>
        </Col>
      </Row>
    </Container>
  )
}
