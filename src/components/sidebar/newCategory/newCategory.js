import React, { useState } from "react";
import Button from './Button';
import "./newCategory.scss";

export default function NewCategory(props) {

  const [categoryName, setCategoryName] = useState(props.categoryName || "");

  return (
    <div className="newCategory">
      <form className="newCategoryForm" onSubmit={event => {event.preventDefault() 
            console.log(categoryName)}} autoComplete="off">
          <input
            className="category__create-input text--semi-bold"
            categoryName = "categoryName"
            type="text"
            value={categoryName}
            placeholder="New Category"
            onChange={event => setCategoryName(event.target.value)}
            data-testid="category-name-input"
          />
          <Button className="category__actions" onClick={() => console.log('cancel')} danger>
            Cancel
          </Button>
          <Button className="category__actions" action='submit' confirm>
            Save
          </Button>
        </form>
      </div>
  )
}