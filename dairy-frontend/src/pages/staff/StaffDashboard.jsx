import React, {
  useState,
  useEffect,
} from "react";

const StaffDashboard = () => {

  const token =
    localStorage.getItem("token");

  const [products, setProducts] =
    useState([]);

  const [milk, setMilk] =
    useState("");

  const [milkList, setMilkList] =
    useState([]);

  const [
    productionList,
    setProductionList,
  ] = useState([]);

  const [form, setForm] =
    useState({
      productId: "",
      quantity: "",
      milkUsed: "",
    });

  const fetchProducts = async () => {

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/products`
    );

    const data = await res.json();

    setProducts(data);
  };

  const fetchMilk = async () => {

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/staff/milk`,
      {
        headers: {
          Authorization:
            "Bearer " + token,
        },
      }
    );

    const data = await res.json();

    setMilkList(data);
  };

  const fetchProduction = async () => {

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/staff/production`,
      {
        headers: {
          Authorization:
            "Bearer " + token,
        },
      }
    );

    const data = await res.json();

    setProductionList(data);
  };

  useEffect(() => {

    fetchProducts();
    fetchMilk();
    fetchProduction();

  }, []);

  const handleMilk = async (e) => {

    e.preventDefault();

    await fetch(
      `${process.env.REACT_APP_API_URL}/api/staff/milk`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            "Bearer " + token,
        },

        body: JSON.stringify({
          quantity: milk,
        }),
      }
    );

    setMilk("");

    fetchMilk();
  };

  const handleProduction =
    async (e) => {

      e.preventDefault();

      if (!form.productId) {

        alert(
          "Select product first"
        );

        return;
      }

      await fetch(
        `${process.env.REACT_APP_API_URL}/api/staff/production`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              "Bearer " + token,
          },

          body: JSON.stringify({
            productId:
              form.productId,

            quantity:
              form.quantity,

            milkUsed:
              form.milkUsed,
          }),
        }
      );

      setForm({
        productId: "",
        quantity: "",
        milkUsed: "",
      });

      fetchProduction();
      fetchProducts();
    };

  return (

    <div className="staff-page">

      <div className="bg one"></div>
      <div className="bg two"></div>

      <div className="staff-container">

        {/* HEADER */}

        <div className="header">

          <span className="badge">
            🧑‍🏭 DairyNest Staff Panel
          </span>

          <h1>
            Production
            <span> Dashboard</span>
          </h1>

          <p>
            Manage milk inventory and
            production operations in
            real-time.
          </p>

        </div>

        <div className="stats-grid">

          <div className="stat-card glass">

            <h2>
              {milkList.length}
            </h2>

            <p>
              Milk Entries
            </p>

          </div>

          <div className="stat-card glass">

            <h2>
              {productionList.length}
            </h2>

            <p>
              Productions
            </p>

          </div>

          <div className="stat-card glass">

            <h2>
              {products.length}
            </h2>

            <p>
              Products
            </p>

          </div>

        </div>

        <div className="main-grid">

          <div className="glass panel">

            <div className="top">

              <h2>
               Add Milk
              </h2>

            </div>

            <form
              onSubmit={handleMilk}
            >

              <input
                type="number"
                placeholder="Milk in Liters"
                value={milk}
                onChange={(e) =>
                  setMilk(
                    e.target.value
                  )
                }
                className="input"
              />

              <button
                className="blue-btn"
              >
                Add Milk
              </button>

            </form>

            <div className="history">

              <h3>
                Milk History
              </h3>

              {
                milkList.map((m) => (

                  <div
                    key={m._id}
                    className="history-card"
                  >

                    <div>

                      <h4>
                        {m.quantity}
                        {" "}
                        Liters
                      </h4>

                      <span>
                        Fresh Milk Entry
                      </span>

                    </div>

                    <small>
                      {
                        new Date(
                          m.date
                        ).toLocaleString()
                      }
                    </small>

                  </div>
                ))
              }

            </div>

          </div>

          {/* PRODUCTION */}

          <div className="glass panel">

            <div className="top">

              <h2>
                🏭 Add Production
              </h2>

            </div>

            <form
              onSubmit={
                handleProduction
              }
            >

              <select
                className="input"
                value={form.productId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    productId:
                      e.target.value,
                  })
                }
              >

                <option value="">
                  Select Product
                </option>

                {
                  products.map((p) => (

                    <option
                      key={p._id}
                      value={p._id}
                    >
                      {p.name}
                    </option>
                  ))
                }

              </select>

              <input
                className="input"
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity:
                      e.target.value,
                  })
                }
              />

              <input
                className="input"
                type="number"
                placeholder="Milk Used"
                value={form.milkUsed}
                onChange={(e) =>
                  setForm({
                    ...form,
                    milkUsed:
                      e.target.value,
                  })
                }
              />

              <button
                className="green-btn"
              >
                Add Production
              </button>

            </form>

            <div className="history">

              <h3>
                Production History
              </h3>

              {
                productionList.map(
                  (p) => (

                    <div
                      key={p._id}
                      className="history-card"
                    >

                      <div>

                        <h4>
                          {p.productName}
                        </h4>

                        <span>
                          Qty:
                          {" "}
                          {p.quantity}
                          {" "}
                          |
                          {" "}
                          Milk:
                          {" "}
                          {p.milkUsed}
                        </span>

                      </div>

                      <small>
                        {
                          new Date(
                            p.date
                          ).toLocaleString()
                        }
                      </small>

                    </div>
                  )
                )
              }

            </div>

          </div>

        </div>

      </div>

      <style>{`

      *{box-sizing:border-box;margin:0;padding:0}

      .staff-page{
        min-height:100vh;
        padding:100px 24px 48px;
        position:relative;
        background:
          linear-gradient(90deg, rgba(23,82,170,0.04) 1px, transparent 1px),
          linear-gradient(rgba(23,82,170,0.04) 1px, transparent 1px),
          linear-gradient(135deg,#ffffff 0%, #e8f6ff 44%, #fff7d9 100%);
        color:#10233f;
      }

      .bg{position:absolute;border-radius:50%;filter:blur(80px);opacity:0.18}
      .bg.one{width:280px;height:280px;left:-80px;top:-80px;background:#ffd43b}
      .bg.two{width:340px;height:340px;right:-100px;bottom:-100px;background:#0b57a4}

      .staff-container{position:relative;z-index:2;max-width:1180px;margin:0 auto}

      .badge{display:inline-block;padding:10px 18px;border-radius:999px;background:#fff2a8;color:#0b57a4;font-weight:800;margin-bottom:18px;border:1px solid rgba(11,87,164,0.08)}

      .header h1{font-size:48px;line-height:1;margin-bottom:12px;font-weight:900;color:#0b3f8a}
      .header h1 span{background:linear-gradient(135deg,#0b57a4,#ffd43b);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
      .header p{color:#415875;font-size:18px;line-height:1.6;margin-bottom:28px}

      /* STATS */
      .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;margin-bottom:28px}
      .stat-card{padding:22px;border-radius:14px;text-align:left;background:linear-gradient(180deg,rgba(255,255,255,0.9),#ffffff);border:1px solid rgba(11,87,164,0.06);box-shadow:0 18px 40px rgba(11,63,138,0.06)}
      .stat-card h2{font-size:40px;margin-bottom:8px;color:#0b57a4}
      .stat-card p{color:#415875;font-size:14px}

      /* GRID */
      .main-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}

      .panel{padding:22px;border-radius:12px;background:rgba(255,255,255,0.98);border:1px solid rgba(11,87,164,0.06);box-shadow:0 20px 48px rgba(11,63,138,0.06)}
      .top{margin-bottom:18px}
      .top h2{font-size:20px;font-weight:900;color:#0b3f8a}

      /* INPUTS */
      .input{width:100%;padding:12px 14px;border-radius:10px;border:1px solid rgba(11,87,164,0.08);margin-bottom:12px;background:#ffffff;color:#10233f;font-size:14px}
      .input:focus{outline:none;box-shadow:0 8px 20px rgba(11,87,164,0.08)}

      select.input option{color:#10233f}

      /* BUTTONS */
      .blue-btn,.green-btn{width:100%;padding:12px;border-radius:10px;border:0;color:#fff;font-weight:800;cursor:pointer;font-size:15px}
      .blue-btn{background:linear-gradient(135deg,#0b57a4,#0878b8)}
      .green-btn{background:linear-gradient(135deg,#22c55e,#16a34a)}
      .blue-btn:hover,.green-btn:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(8,120,184,0.16)}

      /* HISTORY */
      .history{margin-top:20px}
      .history h3{font-size:18px;margin-bottom:12px;color:#0b3f8a}
      .history-card{padding:14px;border-radius:10px;background:#ffffff;border:1px solid rgba(11,87,164,0.04);margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:10px}
      .history-card h4{font-size:16px;margin-bottom:6px;color:#10233f}
      .history-card span{color:#6b7280;font-size:13px}
      .history-card small{color:#9ca3af;font-size:12px}

      /* RESPONSIVE */
      @media(max-width:1000px){.main-grid{grid-template-columns:1fr}}
      @media(max-width:720px){.header h1{font-size:34px}.staff-page{padding-left:18px;padding-right:18px}}

      `}</style>

    </div>
  );
};

export default StaffDashboard;