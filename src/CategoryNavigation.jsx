import React from 'react'

export default function CategoryNavigation({onCategoryClick}) {
    const categories = ['Shirts', 'Pants', 'Accessories', 'Mobiles', 'Mobile Accessories'];

  return (
    <nav className="category-navigation">
        <ul className="category-list">
            {categories.map((categorie, index)=> 
                <li
                    key={index}
                    className="category-item"
                    onClick={() => onCategoryClick(categorie)}>
                    {categorie}
                </li>
            )}
        </ul>
    </nav>
  )
}
