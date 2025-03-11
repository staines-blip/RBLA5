import React from 'react';
import { Link } from 'react-router-dom';
import './FashionForward.css';
import T1 from '../Assets/T1.png';
import B1 from '../Assets/B1.png';
import P1 from '../Assets/P1.png';
import O1 from '../Assets/O1.png';

const FashionForward = () => {
  const categories = [
    {
      id: 1,
      image: T1,
      title: 'Towels',
      link: '/towels'
    },
    {
      id: 2,
      image: B1,
      title: 'Bedsheets',
      link: '/bedsheets'
    },
    {
      id: 3,
      image: P1,
      title: 'Napkins',
      link: '/napkins'
    },
    {
      id: 4,
      image: O1,
      title: 'Bags',
      link: '/bags'
    }
  ];

  const moreCategories = [
    {
      id: 5,
      title: 'Cupcoaster',
      link: '/cupcoaster'
    },
    {
      id: 6,
      title: 'Paperfiles',
      link: '/paperfiles'
    },
    {
      id: 7,
      title: 'Bamboo',
      link: '/bamboo'
    }
  ];

  return (
    <div className="fashion-forward">
      <div className="fashion-forward-left">
        <h1>
          <span>Be</span>
          <span>Fashion</span>
          <span>Forward</span>
        </h1>
        <div className="category-buttons">
          {moreCategories.map(category => (
            <Link key={category.id} to={category.link} className="category-btn">
              {category.title}
            </Link>
          ))}
        </div>
        <Link to="/ProductPage" className="shop-now-btn">
          SHOP NOW
        </Link>
      </div>
      <div className="fashion-forward-right">
        <div className="category-grid">
          {categories.map(category => (
            <Link to={category.link} key={category.id} className="category-card">
              <div className="card-image">
                <img src={category.image} alt={category.title} />
              </div>
              <h3>{category.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FashionForward;
