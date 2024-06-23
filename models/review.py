"""
Review model
"""
from datetime import datetime
from pydantic import BaseModel, Field

class Review(BaseModel):
    """
    The Review class represents the structure of
    an review in the Cosmic Works dataset.
    """
    id: str
    comment: str
    customer_id: str = Field(alias="customerId")
    product_id: str = Field(alias="productId")
    review_date: datetime = Field(alias="reviewDate")
    rating: int