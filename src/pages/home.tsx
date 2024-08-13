import {Link} from 'react-router-dom'
import ProductCard from '../components/product-card'
const Home = () => {

  const addToCardHandler = () => {}

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to='/search' className='findmore'>
          More
          </Link>
      </h1>

      <main>
        <ProductCard productId="abcdef"  price={2345} name="ijroig" photo="https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-config-202402?wid=820&hei=498&fmt=jpeg&qlt=90&.v=1708371033110"  stock={12} handler={addToCardHandler}/>
      </main>
    </div>
  )
}

export default Home
