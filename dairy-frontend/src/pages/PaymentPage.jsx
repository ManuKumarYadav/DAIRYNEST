import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

const PaymentPage = () => {

  const [cart, setCart] = useState([]);

  const [address, setAddress] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  useEffect(() => {

    setCart(
      JSON.parse(
        localStorage.getItem("cart")
      ) || []
    );

    setAddress(
      JSON.parse(
        localStorage.getItem("address")
      )
    );

  }, []);

  const total = cart.reduce(
    (sum, item) =>
      sum +
      (item.price || 0) *
      (item.quantity || 0),
    0
  );

  const getImage = (item) => {

    if (!item.image)
      return "https://via.placeholder.com/100";

    if (item.image.startsWith("http"))
      return item.image;

    return `${process.env.REACT_APP_API_URL}${item.image}`;
  };

  const handlePayment = async () => {

    if (!window.Razorpay) {

      alert("Razorpay not loaded");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/payment/create-order`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            amount: total,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {

        alert("Order creation failed");
        return;
      }

      const options = {

        key:
          process.env
            .REACT_APP_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: data.currency,

        order_id: data.order_id,

        name: "DairyNest",

        description:
          "Premium Dairy Checkout",

        handler:
          async function (response) {

            try {

              const verifyRes =
                await fetch(
                  `${process.env.REACT_APP_API_URL}/api/payment/verify-payment`,
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify(
                      response
                    ),
                  }
                );

              const verifyData =
                await verifyRes.json();

              if (!verifyData.success) {

                alert(
                  "Payment verification failed"
                );

                return;
              }

              const saveRes =
                await fetch(
                  `${process.env.REACT_APP_API_URL}/api/orders`,
                  {
                    method: "POST",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({
                      shopName:
                        "DairyNest",

                      shopOwner:
                        user?.name ||
                        "guest",

                      address:
                        address,

                      products:
                        cart.map(
                          (item) => ({
                            productName:
                              item.name ||
                              item.productName,

                            quantity:
                              item.quantity,

                            price:
                              item.price,

                            image:
                              item.image,
                          })
                        ),
                    }),
                  }
                );

              const saved =
                await saveRes.json();

              if (!saved.success) {

                alert(
                  "Order save failed"
                );

                return;
              }

              localStorage.removeItem(
                "cart"
              );

              navigate(
                "/order-status",
                {
                  state: {
                    orders:
                      saved.data
                        ?.products ||
                      cart,
                  },
                }
              );

            } catch (err) {

              console.log(err);

              alert(
                "Something went wrong"
              );
            }
          },

        prefill: {

          name:
            user?.name || "User",

          email:
            user?.email ||
            "test@gmail.com",

          contact:
            user?.phone ||
            "9999999999",
        },

        theme: {
          color: "#22c55e",
        },
      };

      const razor =
        new window.Razorpay(options);

      razor.open();

    } catch (err) {

      console.log(err);

      alert("Payment error");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="payment-page">

      <div className="bg one"></div>
      <div className="bg two"></div>

      <div className="payment-container">

        {/* LEFT */}

        <div className="left-section">

          {/* ADDRESS */}

          <div className="glass address-card">

            <span className="badge">
              📍 Delivery Address
            </span>

            <h2>
              Shipping Details
            </h2>

            {
              address ? (
                <>

                  <div className="address-box">

                    <h3>
                      {address.name}
                    </h3>

                    <p>
                      {address.address}
                    </p>

                    <p>
                      {address.city}
                      {" "}
                      -
                      {" "}
                      {address.pincode}
                    </p>

                    <span>
                      📞
                      {" "}
                      {address.phone}
                    </span>

                  </div>

                </>
              ) : (
                <p>No Address Found</p>
              )
            }

          </div>

          {/* PRODUCTS */}

          <div className="glass products-card">

            <h2>
              🛒 Order Items
            </h2>

            {
              cart.map((item, i) => (

                <div
                  key={i}
                  className="item-card"
                >

                  <img
                    src={getImage(item)}
                    alt=""
                  />

                  <div className="item-info">

                    <h3>
                      {item.name ||
                        item.productName}
                    </h3>

                    <p>
                      Qty:
                      {" "}
                      {item.quantity}
                    </p>

                  </div>

                  <div className="price">

                    ₹
                    {item.price *
                      item.quantity}

                  </div>

                </div>
              ))
            }

          </div>

        </div>

        {/* RIGHT */}

        <div className="right-section">

          <div className="glass summary">

            <div className="top-dots">

              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>

            </div>

            <h2>
              Payment Summary
            </h2>

            <div className="row">

              <span>
                Items Total
              </span>

              <span>
                ₹{total}
              </span>

            </div>

            <div className="row">

              <span>
                Delivery
              </span>

              <span className="free">
                FREE
              </span>

            </div>

            <div className="row">

              <span>
                GST
              </span>

              <span>
                ₹0
              </span>

            </div>

            <hr />

            <div className="total">

              <span>
                Total
              </span>

              <span>
                ₹{total + 0}
              </span>

            </div>

            <button
              className="pay-btn"
              onClick={handlePayment}
              disabled={loading}
            >

              {
                loading
                  ? "Processing..."
                  : "Proceed To Pay →"
              }

            </button>

            <p className="secure">

              🔒 100% Secure Razorpay Payment

            </p>

          </div>

        </div>

      </div>

      <style>{`

      *{margin:0;padding:0;box-sizing:border-box;font-family:"Poppins",sans-serif;}
      .payment-page{min-height:100vh;padding:100px 24px 48px;position:relative;overflow:hidden;background:linear-gradient(135deg,#f8fbff 0%,#dfeaff 40%,#ffffff 100%);color:#10233f;}
      .payment-page::before{content:'';position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(11,87,164,0.06) 1px,transparent 1px),linear-gradient(rgba(11,87,164,0.06) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;}
      .bg{position:absolute;border-radius:50%;filter:blur(100px);opacity:0.18;}
      .bg.one{width:280px;height:280px;top:20px;left:-80px;background:#ffd43b;}
      .bg.two{width:320px;height:320px;bottom:-90px;right:-90px;background:#0b57a4;}
      .payment-container{position:relative;z-index:2;max-width:1180px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr;gap:28px;}
      .glass{background:#ffffff;border:1px solid rgba(11,87,164,0.08);box-shadow:0 24px 60px rgba(11,63,138,0.08);border-radius:24px;}
      .address-card,.products-card,.summary{padding:28px;margin-bottom:0;}
      .badge{display:inline-flex;align-items:center;gap:10px;padding:12px 18px;border-radius:999px;background:#fff2a8;color:#0b57a4;font-weight:700;border:1px solid rgba(11,87,164,0.08);margin-bottom:18px;}
      h2{font-size:30px;margin-bottom:18px;font-weight:900;color:#0b3f8a;}
      .address-box{padding:22px;border-radius:20px;background:linear-gradient(180deg,#f8fbff,#eef6ff);border:1px solid rgba(11,87,164,0.08);}
      .address-box h3{font-size:22px;margin-bottom:10px;color:#10233f;}
      .address-box p{color:#475569;margin-bottom:8px;line-height:1.7;}
      .address-box span{color:#0b57a4;font-weight:700;}
      .item-card{display:flex;align-items:center;gap:16px;padding:18px;border-radius:18px;background:#f8fbff;border:1px solid rgba(11,87,164,0.08);margin-bottom:16px;}
      .item-card img{width:90px;height:90px;object-fit:cover;border-radius:18px;background:#fff;}
      .item-info{flex:1;}
      .item-info h3{font-size:18px;margin-bottom:6px;color:#10233f;}
      .item-info p{color:#64748b;font-size:14px;margin:0;}
      .price{color:#0b57a4;font-size:18px;font-weight:800;}
      .summary{position:sticky;top:100px;}
      .top-dots{display:flex;gap:10px;margin-bottom:22px;}
      .dot{width:14px;height:14px;border-radius:50%;}
      .red{background:#ef4444;}
      .yellow{background:#f59e0b;}
      .green{background:#22c55e;}
      .row{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;color:#475569;font-size:16px;}
      .free{color:#0b57a4;font-weight:800;}
      hr{border:none;height:1px;background:rgba(11,87,164,0.12);margin:24px 0;}
      .total{display:flex;justify-content:space-between;align-items:center;font-size:26px;font-weight:900;margin-bottom:24px;color:#10233f;}
      .pay-btn{width:100%;padding:16px 20px;border:none;border-radius:16px;background:linear-gradient(135deg,#0b57a4,#0878b8);color:#fff;font-size:16px;font-weight:800;cursor:pointer;transition:transform .2s ease,box-shadow .2s ease;}
      .pay-btn:hover{transform:translateY(-2px);box-shadow:0 18px 36px rgba(8,120,184,0.18);}
      .pay-btn:disabled{opacity:.75;cursor:not-allowed;}
      .secure{text-align:center;margin-top:18px;color:#64748b;font-size:14px;}
      @media(max-width:1000px){.payment-container{grid-template-columns:1fr;}.summary{position:static;top:auto;}} 
      @media(max-width:720px){.payment-page{padding:90px 16px 40px;}h2{font-size:26px;}.item-card{flex-direction:column;align-items:flex-start;}.price{align-self:flex-end;}.address-card,.products-card,.summary{padding:22px;}}

      `}</style>

    </div>
  );
};

export default PaymentPage;