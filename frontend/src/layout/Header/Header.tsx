import { Carousel } from 'antd'
import carousel1 from '../../assets/carousel1.png'
import carousel2 from '../../assets/carousel2.png'

import './header.css'
const CustomHeader = () => {
  return (
    <div
      style={{
        paddingTop: '0px',
        paddingRight: '100px',
        paddingLeft: '100px ',
      }}
    >
      <Carousel autoplay autoplaySpeed={3000}>
        <div>
          <img src={carousel2} alt='Slide 1' className='carousel-image' />
        </div>
        <div>
          <img src={carousel1} alt='Slide 2' className='carousel-image' />
        </div>
      </Carousel>
    </div>
  )
}

export default CustomHeader
