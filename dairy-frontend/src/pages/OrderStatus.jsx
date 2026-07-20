import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const OrderStatus = () => {

  const location = useLocation();

  const navigate = useNavigate();

  let orders = location.state?.orders;

  if (!orders) {

    const saved =
      JSON.parse(
        localStorage.getItem("latestOrders")
      );

    orders = saved || [];
  }

  if (!orders || orders.length === 0) {

    return (

      <div className="status-page">

        <div className="bg one"></div>
        <div className="bg two"></div>

        <div className="empty-card glass">

          <div className="empty-icon">
            📦
          </div>

          <h1>No Orders Found</h1>

          <p>
            Looks like you haven't placed
            any premium dairy orders yet.
          </p>

          <button
            className="shop-btn"
            onClick={() => navigate("/shop")}
          >
            Go To Shop
          </button>

        </div>

        <Style />

      </div>
    );
  }

  return (

    <div className="status-page">

      <div className="bg one"></div>
      <div className="bg two"></div>

      <div className="status-container">

        {/* TOP */}

        <div className="success-section">

          <div className="success-icon">
            ✓
          </div>

          <span className="badge">
            Payment Successful
          </span>

          <h1>
            Order
            <span> Confirmed</span>
          </h1>

          <p>
            Your premium dairy products
            are now being prepared and
            shipped.
          </p>

        </div>

        {/* ORDERS */}

        <div className="orders-grid">

          {
            orders.map((order, index) => (

              <div
                key={index}
                className="order-card glass"
              >

                <div className="top-row">

                  <div>

                    <h2>
                      {order?.productName ||
                        "Product"}
                    </h2>

                    <p className="shop-name">
                      🏪
                      {" "}
                      {order?.shopName}
                    </p>

                  </div>

                  <div className="qty-box">

                    x
                    {order?.quantity}

                  </div>

                </div>

                <div className="line"></div>

                <div className="status-row">

                  <span>
                    Order Status
                  </span>

                  <div className="status-badge">
                    {order?.status}
                  </div>

                </div>

                <div className="delivery-box">

                  <h4>
                    🚚 Delivery Update
                  </h4>

                  <p>
                    Your order is packed and
                    will arrive shortly.
                  </p>

                </div>

                {/* TRACKING */}

                <div className="tracking">

                  <div className="track-line">

                    <div className="dot active"></div>
                    <div className="dot active"></div>
                    <div className="dot"></div>

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

        {/* BUTTON */}

        <button
          className="view-btn"
          onClick={() => navigate("/orders")}
        >
          View All Orders →
        </button>

      </div>

      <Style />

    </div>
  );
};

const Style = () => (

  <style>{`

  *{margin:0;padding:0;box-sizing:border-box;font-family:"Poppins",sans-serif;}

  .status-page{min-height:100vh;padding:100px 24px 60px;position:relative;overflow:hidden;background:linear-gradient(135deg,#f8fbff 0%,#dfeaff 40%,#ffffff 100%);color:#10233f;}
  .status-page::before{content:"";position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(11,87,164,0.06) 1px,transparent 1px),linear-gradient(rgba(11,87,164,0.06) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;}
  .bg{position:absolute;border-radius:50%;filter:blur(100px);opacity:0.2;}
  .bg.one{width:280px;height:280px;top:20px;left:-80px;background:#ffd43b;}
  .bg.two{width:320px;height:320px;bottom:-90px;right:-90px;background:#0b57a4;}

  .status-container{position:relative;z-index:2;max-width:1180px;margin:0 auto;}

  .success-section{text-align:center;margin-bottom:50px;}
  .success-icon{width:110px;height:110px;margin:0 auto 24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:900;background:linear-gradient(135deg,#0b57a4,#ffd43b);box-shadow:0 24px 54px rgba(11,87,164,0.16);color:#10233f;}
  .badge{display:inline-flex;align-items:center;gap:10px;padding:12px 18px;border-radius:999px;background:#fff2a8;border:1px solid rgba(11,87,164,0.08);color:#0b57a4;font-weight:700;margin-bottom:22px;}
  .success-section h1{font-size:clamp(42px,5vw,62px);line-height:1.02;margin-bottom:18px;font-weight:900;color:#0b3f8a;}
  .success-section h1 span{background:linear-gradient(135deg,#0b57a4,#ffd43b);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .success-section p{color:#4b6384;font-size:17px;max-width:720px;margin:0 auto;line-height:1.75;}

  .orders-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px;margin-bottom:42px;}
  .glass{background:#ffffff;border:1px solid rgba(11,87,164,0.08);box-shadow:0 24px 60px rgba(11,63,138,0.08);border-radius:24px;}
  .order-card{padding:26px;display:flex;flex-direction:column;gap:20px;}
  .top-row{display:flex;justify-content:space-between;gap:18px;align-items:center;}
  .top-row h2{font-size:24px;margin:0;color:#0b57a4;}
  .shop-name{margin:6px 0 0;color:#64748b;font-size:14px;}
  .qty-box{padding:10px 18px;border-radius:999px;background:linear-gradient(135deg,#dbeafe,#bfdbfe);color:#0b3f8a;font-weight:700;}
  .line{height:1px;background:rgba(15,23,42,0.06);margin:0 -26px;}
  .status-row{display:flex;justify-content:space-between;align-items:center;gap:12px;}
  .status-row span{color:#64748b;font-weight:700;}
  .status-badge{padding:10px 16px;border-radius:999px;background:#f8fafc;color:#0b57a4;font-weight:800;font-size:13px;}
  .delivery-box{padding:18px;border-radius:18px;background:linear-gradient(180deg,#f8fbff,#eef6ff);border:1px solid rgba(11,87,164,0.08);}
  .delivery-box h4{margin:0 0 8px;color:#0b3f8a;font-size:16px;}
  .delivery-box p{margin:0;color:#64748b;font-size:15px;line-height:1.7;}
  .tracking{display:grid;gap:12px;}
  .track-line{position:relative;height:12px;border-radius:999px;background:#e2e8f0;overflow:hidden;}
  .track-line::after{content:'';position:absolute;left:0;top:0;height:100%;width:100%;background:linear-gradient(90deg,#0b57a4,#ffd43b);transform:scaleX(0.7);transform-origin:left;}
  .dot{position:relative;display:inline-flex;width:16px;height:16px;border-radius:50%;background:#fff;border:3px solid #e2e8f0;}
  .labels{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;text-align:center;font-size:13px;color:#64748b;}
  .labels span{font-weight:700;}
  .view-btn{display:inline-flex;align-items:center;justify-content:center;padding:16px 24px;border-radius:14px;background:linear-gradient(135deg,#0b57a4,#0878b8);color:#fff;font-size:16px;font-weight:800;border:none;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;}
  .view-btn:hover{transform:translateY(-2px);box-shadow:0 18px 36px rgba(8,120,184,0.18);}
  @media(max-width:1000px){.orders-grid{grid-template-columns:1fr;}.top-row{flex-direction:column;align-items:flex-start;}.status-row{flex-direction:column;align-items:flex-start;}} 
  @media(max-width:720px){.status-page{padding:90px 16px 40px;}.success-section h1{font-size:40px;}.order-card{padding:22px;}.view-btn{width:100%;}}

  `}</style>
);

export default OrderStatus;