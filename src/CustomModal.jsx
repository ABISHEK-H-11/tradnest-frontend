// CustomModal.jsx
import React, { useEffect, useState } from "react";
import "./assets/modalStyles.css";

const CustomModal = ({ modalType, onClose, onSubmit, response }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    month: "",
    year: "",
    date: "",
  });

  const [inputValue, setInputValue] = useState(""); // Generalized input for all cases

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGeneralInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (modalType) {
      case "addProduct": {
        const processedData = {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock, 10),
          categoryId: parseInt(formData.categoryId, 10),
        };
        onSubmit(processedData);
        break;
      }
      case "deleteProduct": {
        const productId = parseInt(inputValue, 10);
        onSubmit({ productId });
        break;
      }
      case "viewUser": {
        const userId = parseInt(inputValue, 10);
        onSubmit({ userId });
        break;
      }
      case "modifyUser": {
        const fd = new FormData(e.target);
        const data = {
          userId: parseInt(inputValue, 10),
          username: fd.get("username"),
          email: fd.get("email"),
          role: fd.get("role"),
        };
        onSubmit(data);
        break;
      }
      case "monthlyBusiness": {
        const month = formData.month;
        const year = formData.year;
        onSubmit({ month, year });
        break;
      }
      case "dailyBusiness": {
        const date = formData.date;
        onSubmit({ date });
        break;
      }

      case "yearlyBusiness": {
        const year = formData.year;
        onSubmit({ year });
        break;
      }

      case "overallBusiness": {
        onSubmit();
        break;
      }

      default:
        break;
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">&times;</button>
        {/* Add Product Form */}
        {modalType === "addProduct" &&
          (!response || response?.message || !(response?.product && (response.product.product || response.product.productId || response.product.name)) ? (
            <>
              <h2>Add Product</h2>
              {response?.message && (
                <div className="modal-error" style={{ color: "#e74c3c", marginBottom: "12px" }}>{response.message}</div>
              )}
              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="modal-form-item">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="price">Price:</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="stock">Stock:</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="categoryId">Category ID:</label>
                  <input
                    type="number"
                    id="categoryId"
                    name="categoryId"
                    placeholder="Category ID"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-form-item">
                  <label htmlFor="imageUrl">Image URL:</label>
                  <input
                    type="text"
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="modal-form-item">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </form>

              <div className="modal-actions">
                <button type="button" onClick={handleSubmit} className="modal-btn modal-btn-primary">Submit</button>
                <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">Cancel</button>
              </div>
            </>
          ) : (
            <>
              <h2>Product Details</h2>
              <div className="full-products">
                <div className="product-details img">
                  <img src={response.product?.imageUrl || response.imageUrl} alt="Product" />
                </div>
                <div className="product-details-info">
                  <div className="product-details">
                    <div className="">Name :</div>
                    <div className="">{response?.product?.product?.name}</div>
                  </div>
                  <div className="product-details">
                    <div className="">Description :</div>
                    <div className="">
                      {response?.product?.product?.description}
                    </div>
                  </div>
                  <div className="product-details">
                    <div className="">price :</div>
                    <div className="">{response?.product?.product?.price}</div>
                  </div>
                  <div className="product-details">
                    <div className="">Stock :</div>
                    <div className="">{response?.product?.product?.stock}</div>
                  </div>
                  <div className="product-details">
                    <div className="">Category :</div>
                    <div className="">
                      {response?.product?.product?.category.categoryName}
                    </div>
                  </div>
                </div>
              </div>
              <div className="product-details modal-actions">
                <button type="button" onClick={onClose} className="modal-btn modal-btn-primary">Close</button>
              </div>
            </>
          ))}

        {/* Delete Product Form */}
        {modalType === "deleteProduct" &&
          (!response ? (
            <>
              <h2>Delete Product</h2>
              <form>
                <input
                  type="number"
                  placeholder="Enter Product ID"
                  value={inputValue}
                  onChange={handleGeneralInputChange}
                />
              </form>
              <div className="modal-actions">
                <button type="button" onClick={handleSubmit} className="modal-btn modal-btn-danger">Delete</button>
                <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">Cancel</button>
              </div>
            </>
          ) : (
            <div>
              <h2>Product Deleted Successfully</h2>
              <button type="button" onClick={onClose} className="modal-btn modal-btn-primary">Close</button>
            </div>
          ))}

        {/* View User Details Form */}
        {modalType === "viewUser" && (
          <>
            <h2>View User Details</h2>
            <form>
              <input
                type="number"
                placeholder="Enter User ID"
                value={inputValue}
                onChange={handleGeneralInputChange}
              />
            </form>
            <div className="modal-actions">
              <button type="button" onClick={handleSubmit} className="modal-btn modal-btn-primary">Submit</button>
              <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">Cancel</button>
            </div>
          </>
        )}

        {/* Response Display */}
        {modalType === "response" && response && (
          <>
            {response.user ? (
              <>
                <h2>User Details</h2>
                <div className="user-details">
                  <p>
                    <strong>User ID:</strong> {response.user.userId}
                  </p>
                  <p>
                    <strong>Username:</strong> {response.user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {response.user.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {response.user.role}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(response.user.created_at).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(response.user.updated_at).toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h2>Error 1</h2>
                <p>Something went wrong.</p>
              </>
            )}
            <button type="button" onClick={onClose} className="modal-btn modal-btn-primary">Back to Dashboard</button>
          </>
        )}
        {modalType === "monthlyBusiness" && (
          <>
            <form className="modal-form">
              {!response && (
                <>
                  <div className="modal-form-item">
                    <label htmlFor="month">Month:</label>
                    <input
                      type="number"
                      id="month"
                      name="month"
                      placeholder="10"
                      value={formData.month}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="modal-form-item">
                    <label htmlFor="year">Year:</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      placeholder="2025"
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="button" onClick={handleSubmit} className="modal-btn modal-btn-primary">Submit</button>
                </>
              )}
              {response && (
                <div>
                  <div className="business-response-item">
                    <div>Total Business: ₹ </div>
                    <div>
                      {(Number(response?.monthlyBusiness?.totalBusiness ?? response?.monthlyBusiness?.totalRevinue ?? response?.monthlyBusiness?.totalRevenue) ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="business-response-item">
                    <h5>Category Sales</h5>
                  </div>
                  {Object.keys(response?.monthlyBusiness?.categorySales || response?.monthlyBusiness?.catagory || {})?.map(
                    (key) => {
                      const sales = response?.monthlyBusiness?.categorySales || response?.monthlyBusiness?.catagory || {};
                      return (
                        <div key={key} className="business-response-item">
                          <div>{key}</div>
                          <div>{sales[key]}</div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              <button onClick={onClose}>Cancel</button>
            </form>
          </>
        )}

        {modalType === "dailyBusiness" && (
          <>
            <form className="modal-form">
              {!response && (
                <>
                  <div className="modal-form-item">
                    <label htmlFor="date">Date:</label>
                    <input
                      type="text"
                      id="date"
                      name="date"
                      placeholder="2025-12-31"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="button" onClick={handleSubmit} className="modal-btn modal-btn-primary">Submit</button>
                </>
              )}
              {response && (
                <div>
                  <div className="business-response-item">
                    <div>Total Business: ₹ </div>
                    <div>
                      {(Number(response?.dailyBusiness?.totalBusiness ?? response?.dailyBusiness?.totalRevinue ?? response?.dailyBusiness?.totalRevenue) ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="business-response-item">
                    <h5>Category Sales</h5>
                  </div>
                  {Object.keys(response?.dailyBusiness?.categorySales || response?.dailyBusiness?.catagory || {})?.map(
                    (key) => {
                      const sales = response?.dailyBusiness?.categorySales || response?.dailyBusiness?.catagory || {};
                      return (
                        <div key={key} className="business-response-item">
                          <div>{key}</div>
                          <div>{sales[key]}</div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              <button onClick={onClose}>Cancel</button>
            </form>
          </>
        )}

        {modalType === "yearlyBusiness" && (
          <>
            <form className="modal-form">
              {!response && (
                <>
                  <div className="modal-form-item">
                    <label htmlFor="year">Year:</label>
                    <input
                      type="number"
                      id="year"
                      name="year"
                      placeholder="2025"
                      value={formData.year}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="button" onClick={handleSubmit} className="modal-btn modal-btn-primary">Submit</button>
                </>
              )}
              {response && (
                <div>
                  <div className="business-response-item">
                    <div>Total Business: ₹ </div>
                    <div>
                      {(Number(response?.yearlyBusiness?.totalBusiness ?? response?.yearlyBusiness?.totalRevinue ?? response?.yearlyBusiness?.totalRevenue) ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="business-response-item">
                    <h5>Category Sales</h5>
                  </div>
                  {Object.keys(response?.yearlyBusiness?.categorySales || response?.yearlyBusiness?.catagory || {})?.map(
                    (key) => {
                      const sales = response?.yearlyBusiness?.categorySales || response?.yearlyBusiness?.catagory || {};
                      return (
                        <div key={key} className="business-response-item">
                          <div>{key}</div>
                          <div>{sales[key]}</div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              <button onClick={onClose}>Cancel</button>
            </form>
          </>
        )}

        {modalType === "overallBusiness" && (
          <>
            <form className="modal-form">
              {!response && (
                <>
                      <button type="button" onClick={handleSubmit} className="modal-btn modal-btn-primary">Get Overall Business</button>
                </>
              )}
              {response && (
                <div>
                  <div className="business-response-item">
                    <div>Total Business: ₹ </div>
                    <div>
                      {(Number(response?.overallBusiness?.totalBusiness ?? response?.overallBusiness?.totalRevinue ?? response?.overallBusiness?.totalRevenue) ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="business-response-item">
                    <h5>Category Sales</h5>
                  </div>
                  {Object.keys(response?.overallBusiness?.categorySales || response?.overallBusiness?.catagory || {})?.map(
                    (key) => {
                      const sales = response?.overallBusiness?.categorySales || response?.overallBusiness?.catagory || {};
                      return (
                        <div key={key} className="business-response-item">
                          <div>{key}</div>
                          <div>{sales[key]}</div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}

              <button onClick={onClose}>Cancel</button>
            </form>
          </>
        )}

        {/* ModifyUser */}
        {modalType === "modifyUser" && (
          <ModifyUserFormComponent onClose={onClose} />
        )}
      </div>
    </div>
  );
};

export default CustomModal;

const ModifyUserFormComponent = ({ onClose }) => {
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [updated, setUpdated] = useState(false);

  const handleFetchUser = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const userid = formData.get("user-id");

      if (!userid) return;

      const response = await fetch("https://tradnest-backend-production.up.railway.app/api/admin/user/getbyid", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userid }), // Ensure userId is correctly passed
      });

      if (response.ok) {
        const user = await response.json();
        console.log("userDetails2==>", user);

        setUserDetails(user);
        setUserId(userid);
      }
    } catch (error) {
      console.log("Error fetching user details", error);
    }
  };

  useEffect(() => {
    console.log("userDetails==>", userDetails);
  }, [userDetails]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const role = formData.get("role");

    const response = await fetch("https://tradnest-backend-production.up.railway.app/api/admin/user/modify", {
      method: "POST",    
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: +userId,
        username: username,
        email: email,
        role: role,
      }),
    });

    if (response.ok) {
      const user = await response.json();
      console.log("userDetails2==>", user);

      setUpdated(true);
      setUserDetails(user);
    }
  };

  if (!userDetails) {
    return (
      <form onSubmit={handleFetchUser} className="modal-form">
        <div className="modal-form-item">
          <label htmlFor="user-id">User ID:</label>
          <input
            type="text"
            id="user-id"
            name="user-id"
            value={userId ?? ""}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <button type="submit" className="modal-btn modal-btn-primary">Get User</button>
        <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">Cancel</button>
      </form>
    );
  }

  if (userDetails && !updated) {
    return (
      <div>
        <h2 className="modal-heading">Modify User</h2>
        <form onSubmit={handleUpdateUser} className="modal-form">
          <div className="modal-form-item">
            <label htmlFor="user-id">User ID:</label>
            <input
              type="text"
              id="user-id"
              name="user-id"
              value={userId ?? ""}
              readOnly
              className="modal-input-readonly"
            />
          </div>
          <div className="modal-form-item">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              defaultValue={userDetails?.username}
            />
          </div>

          <div className="modal-form-item">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={userDetails?.email}
            />
          </div>
          <div className="modal-form-item">
            <label htmlFor="role">Role:</label>
            <input
              type="text"
              id="role"
              name="role"
              defaultValue={userDetails.role}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="modal-btn modal-btn-primary">Update User</button>
            <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    );
  }
  if (updated) {
    return (
      <div>
        <h2>Updated User Details</h2>
        <div className="user-details">
          <p>
            <strong>User ID:</strong> {userDetails.userId}
          </p>
          <p>
            <strong>Username:</strong> {userDetails.username}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Role:</strong> {userDetails.role}
          </p>
        </div>
        <button type="button" onClick={onClose} className="modal-btn modal-btn-primary">Close</button>
      </div>
    );
  }
  return <></>;
};
