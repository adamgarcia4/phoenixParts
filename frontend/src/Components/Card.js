import React from 'react'
import PropTypes from 'prop-types'

const Card = ({img, title, body}) => {

  const titleElem = <h5 className="card-title">{title}</h5>
  const imageElem = <img src={img} className='card-img-top' alt={title}/>
  const bodyElem =  <p className="card-text">{body}</p>

  return (
    <div className="card m-1" style={{width: '18rem'}}>
      {img ? imageElem : null}
      <div className="card-body">
        {title ? titleElem : null}
        {body ? bodyElem : null}
        <a href="#" className="btn btn-primary">
          Go somewhere
        </a>
      </div>
    </div>
  )
}

Card.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string
}

export default Card
