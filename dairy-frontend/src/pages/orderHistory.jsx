import React, { useEffect, useState } from "react";

const OrderHistory = () => {

  const [orders, setOrders] = useState([]);

  const user =
    JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {

    try {

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/shop/${user?.name}`
      );

      const data = await res.json();

      setOrders(data.data || []);

    } catch (err) {

      console.log(err);
    }
  };

  const cancelOrder = async (id) => {

    try {

      await fetch(
        `${process.env.REACT_APP_API_URL}/api/orders/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: "Cancelled",
          }),
        }
      );

      fetchOrders();

    } catch (err) {

      console.log(err);
    }
  };

  const getProgress = (status) => {

    if (status === "Placed") return "15%";

    if (status === "Paid") return "60%";

    if (status === "Delivered") return "100%";

    return "0%";
  };

  const getImage = (img) => {

    if (!img)
      return "https://via.placeholder.com/120";

    if (img.startsWith("http"))
      return img;

    return `${process.env.REACT_APP_API_URL}${img}`;
  };

  return (

    <>
      <div className="orders-page">

        <div className="bg-glow one"></div>
        <div className="bg-glow two"></div>

        <div className="orders-container">

          <div className="heading">

            <span className="badge">
              📦 DairyNest Orders
            </span>

            <h1>
              My Premium
              <span> Orders</span>
            </h1>

            <p>
              Track your fresh dairy deliveries
              in real-time.
            </p>

          </div>

          {
            orders.length === 0 && (

              <div className="empty glass">

                <h2>No Orders Found</h2>

                <p>
                  Your premium dairy orders
                  will appear here.
                </p>

              </div>
            )
          }

          {
            orders.map((order) => (

              <div
                key={order._id}
                className="order-card glass"
              >

                <div className="top-section">

                  <div>

                    <span
                      className={`status ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>

                    <h2>
                      ₹{order.totalPrice}
                    </h2>

                  </div>

                  {
                    order.status !== "Cancelled" &&
                    order.status !== "Delivered" && (

                      <button
                        className="cancel-btn"
                        onClick={() =>
                          cancelOrder(order._id)
                        }
                      >
                        Cancel Order
                      </button>
                    )
                  }

                </div>

                <div className="products-grid">

                  {
                    order.products.map((item, i) => (

                      <div
                        key={i}
                        className="product-card"
                      >

                        <div className="img-box">

                          <img
                            src={getImage(item.image)}
                            alt=""
                          />

                        </div>

                        <div className="product-info">

                          <h3>
                            {item.productName}
                          </h3>

                          <p>
                            Quantity:
                            {" "}
                            {item.quantity}
                          </p>

                          <span>
                            ₹
                            {item.price *
                              item.quantity}
                          </span>

                        </div>

                      </div>
                    ))
                  }

                </div>

                <div className="address-box">

                  <h4>
                    🚚 Delivery Address
                  </h4>

                  <p>
                    {order?.address?.name}
                  </p>

                  <p>
                    {order?.address?.city}
                    {" "}
                    -
                    {" "}
                    {order?.address?.pincode}
                  </p>

                  <p>
                    📞
                    {" "}
                    {order?.address?.phone}
                  </p>

                </div>

                <div className="tracking">

                  <div
                    className="track-line"
                    style={{
                      "--progress":
                        getProgress(order.status),
                    }}
                  >

                    <div className="dot active"></div>

                    <div
                      className={`dot ${
                        order.status !== "Placed"
                          ? "active"
                          : ""
                      }`}
                    ></div>

                    <div
                      className={`dot ${
                        order.status ===
                        "Delivered"
                          ? "active"
                          : ""
                      }`}
                    ></div>

                  </div>

                  <div className="labels">

                    <span>Placed</span>
                    <span>Paid</span>
                    <span>Delivered</span>

                  </div>

                </div>

              </div>
            ))
          }

        </div>

      </div>

      <style>{`

      *{margin:0;padding:0;box-sizing:border-box;font-family:"Poppins",sans-serif;}

      .orders-page{min-height:100vh;padding:100px 24px 60px;background:linear-gradient(135deg,#f8fbff 0%,#dfeaff 40%,#ffffff 100%);color:#10233f;position:relative;overflow:hidden;}
      .orders-page::before{content:"";position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(11,87,164,0.06) 1px,transparent 1px),linear-gradient(rgba(11,87,164,0.06) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;}
      .bg-glow{position:absolute;border-radius:50%;filter:blur(100px);opacity:0.2;}
      .bg-glow.one{width:280px;height:280px;top:20px;left:-80px;background:#ffd43b;}
      .bg-glow.two{width:320px;height:320px;bottom:-90px;right:-90px;background:#0b57a4;}

      .orders-container{position:relative;z-index:2;max-width:1180px;margin:0 auto;}
      .heading{margin-bottom:42px;}
      .heading .badge{display:inline-flex;align-items:center;gap:10px;padding:12px 18px;border-radius:999px;background:#fff2a8;color:#0b57a4;font-weight:800;font-size:13px;}
      .heading h1{font-size:clamp(42px,5vw,64px);font-weight:900;line-height:1.02;margin-top:18px;}
      .heading h1 span{background:linear-gradient(135deg,#0b57a4,#ffd43b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
      .heading p{max-width:720px;margin-top:16px;color:#4b6384;font-size:17px;line-height:1.8;}

      .empty{padding:48px;border-radius:28px;background:#ffffff;border:1px solid rgba(11,87,164,0.08);box-shadow:0 28px 70px rgba(11,63,138,0.08);text-align:center;}
      .empty h2{font-size:28px;margin-bottom:10px;color:#0b3f8a;}
      .empty p{color:#64748b;font-size:16px;}

      .glass{background:#ffffff;border:1px solid rgba(11,87,164,0.08);}
      .order-card{padding:28px;border-radius:28px;background:#ffffff;border:1px solid rgba(11,87,164,0.08);box-shadow:0 30px 80px rgba(11,63,138,0.08);margin-bottom:26px;}
      .top-section{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:28px;}
      .top-section h2{margin:0;line-height:1;color:#0b57a4;font-size:36px;}
      .status{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;font-size:13px;font-weight:800;color:#10233f;background:#fff2a8;text-transform:uppercase;letter-spacing:.02em;}
      .status.placed{background:#fef3c7;}
      .status.paid{background:#bfdbfe;}
      .status.delivered{background:#bbf7d0;}
      .status.cancelled{background:#fee2e2;color:#b91c1c;}
      .cancel-btn{border:none;padding:12px 18px;border-radius:14px;background:#ef4444;color:#fff;font-weight:700;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;}
      .cancel-btn:hover{transform:translateY(-2px);box-shadow:0 16px 32px rgba(239,68,68,0.18);}
      .products-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin-bottom:28px;}
      .product-card{display:flex;gap:16px;padding:18px;border-radius:18px;background:#f8fbff;border:1px solid rgba(11,87,164,0.08);}
      .img-box{width:100px;height:100px;border-radius:18px;overflow:hidden;background:#e2edff;flex-shrink:0;box-shadow:0 12px 24px rgba(11,63,138,0.08);}
      .img-box img{width:100%;height:100%;object-fit:cover;}
      .product-info{flex:1;display:flex;flex-direction:column;justify-content:space-between;}
      .product-info h3{font-size:18px;margin:0;color:#10233f;}
      .product-info p{margin:8px 0 0;color:#64748b;font-size:14px;}
      .product-info span{font-size:16px;font-weight:800;color:#0b57a4;}
      .address-box{padding:22px;border-radius:20px;background:linear-gradient(180deg,#f8fbff,#eef6ff);border:1px solid rgba(11,87,164,0.08);}
      .address-box h4{font-size:16px;margin-bottom:10px;color:#0b3f8a;}
      .address-box p{margin:4px 0;color:#475569;font-size:15px;}
      .tracking{margin-top:24px;}
      .track-line{position:relative;height:12px;border-radius:999px;background:#e2e8f0;overflow:hidden;margin-bottom:14px;}
      .track-line::after{content:'';position:absolute;left:0;top:0;height:100%;width:var(--progress,0%);background:linear-gradient(90deg,#0b57a4,#ffd43b);}
      .dot{position:absolute;top:50%;width:16px;height:16px;border-radius:50%;transform:translate(-50%,-50%);background:#fff;border:3px solid #e2e8f0;transition:background .2s ease,border-color .2s ease;}
      .dot:nth-child(1){left:0%;}
      .dot:nth-child(2){left:50%;}
      .dot:nth-child(3){left:100%;}
      .dot.active{background:#0b57a4;border-color:#0b57a4;}
      .labels{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;font-size:13px;color:#64748b;}
      .labels span{font-weight:700;}
      @media(max-width:1000px){.top-section{flex-direction:column;align-items:flex-start;}.products-grid{grid-template-columns:1fr;}}
      @media(max-width:720px){.orders-page{padding:90px 16px 40px;}.heading h1{font-size:40px;}.order-card{padding:22px;}.products-grid{gap:14px;}.product-card{flex-direction:column;align-items:center;text-align:center;}.img-box{width:100%;height:180px;}.product-info{align-items:center;}}
      `}</style>

    </>
  );
};

export default OrderHistory;