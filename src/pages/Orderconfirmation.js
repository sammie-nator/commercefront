import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import api from "../api/axios";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";

const POLL_MS = 3000; // how often we ask the backend
const GIVE_UP_MS = 2 * 60 * 1000; // stop auto-checking after 2 minutes (user can resume)

const money = (n) => `KES ${Number(n || 0).toLocaleString()}`;

const primaryBtn = "btn-primary";
const secondaryBtn = "btn-ghost";

// The one animated moment on this page: the tick draws itself when payment is confirmed
const ConfirmedMark = () => {
  const reduceMotion = useReducedMotion();
  return (
    <div className="h-20 w-20 rounded-full bg-mpesa border-2 border-ink shadow-pop flex items-center justify-center mx-auto mb-6">
      <svg
        viewBox="0 0 24 24"
        className="h-8 w-8"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        />
      </svg>
    </div>
  );
};

const FailedMark = () => (
  <div className="h-20 w-20 rounded-full bg-accent-100 border-2 border-ink text-accent-600 flex items-center justify-center mx-auto mb-6">
    <svg
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  </div>
);

const Row = ({ label, children }) => (
  <div className="flex justify-between gap-6 py-2 text-sm">
    <dt className="text-ink/60 shrink-0">{label}</dt>
    <dd className="text-ink text-right break-words min-w-0">{children}</dd>
  </div>
);

const OrderConfirmation = () => {
  const { checkoutId } = useParams();
  const { clearCart } = useCart();
  const [result, setResult] = useState({ status: "pending" });
  const [timedOut, setTimedOut] = useState(false);
  const [round, setRound] = useState(0); // bumped by "Check again" to restart polling
  const cartCleared = useRef(false);

  useEffect(() => {
    let stopped = false;
    let timer;
    const startedAt = Date.now();
    setTimedOut(false);

    const poll = async () => {
      try {
        const { data } = await api.get(`/orders/checkout/${checkoutId}`);
        if (stopped) return;
        setResult(data);

        // Clear cart once payment is confirmed (only once)
        if (data.status === "confirmed" && !cartCleared.current) {
          cartCleared.current = true;
          clearCart();
        }

        if (data.status !== "pending") return; // confirmed or failed: nothing more to wait for
      } catch (err) {
        if (stopped) return;
        if (err.response?.status === 404) {
          setResult({ status: "notfound" });
          return;
        }
        // any other error is probably a network blip: keep trying
      }
      if (Date.now() - startedAt > GIVE_UP_MS) {
        setTimedOut(true);
        return;
      }
      timer = setTimeout(poll, POLL_MS);
    };

    poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [checkoutId, round, clearCart]);

  const { status } = result;

  return (
    <div className="max-w-xl mx-auto px-4 py-16" aria-live="polite">
      {/* Waiting for the customer / Daraja */}
      {status === "pending" && (
        <div className="text-center">
          {timedOut ? (
            <>
              <h1 className="font-display font-extrabold text-3xl mb-3">
                Still waiting for M-Pesa
              </h1>
              <p className="text-ink/70 leading-relaxed mb-8">
                If you've entered your PIN, give it a moment. Your order appears here as soon as
                the payment is confirmed. If you didn't get a prompt, go back and try again.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button type="button" onClick={() => setRound((r) => r + 1)} className={primaryBtn}>
                  Check again
                </button>
                <Link to="/cart" className={secondaryBtn}>
                  Back to cart
                </Link>
              </div>
            </>
          ) : (
            <>
              <Loader label="Waiting for M-Pesa confirmation..." />
              <h1 className="font-display font-extrabold text-3xl mt-6 mb-3">
                Enter your M-Pesa PIN
              </h1>
              <p className="text-ink/70 leading-relaxed">
                Approve the payment prompt on your phone. Keep this page open. It updates
                automatically when the payment goes through.
              </p>
            </>
          )}
        </div>
      )}

      {/* Payment did not go through: no order was created */}
      {status === "failed" && (
        <div className="text-center">
          <FailedMark />
          <h1 className="font-display font-extrabold text-3xl mb-3">
            Payment didn't go through
          </h1>
          <p className="text-ink/70 leading-relaxed mb-2">
            {result.message || "M-Pesa didn't confirm this payment."}
          </p>
          <p className="text-ink/60 text-sm mb-8">No order was placed. Your cart is unchanged.</p>
          <Link to="/cart" className={primaryBtn}>
            Back to cart
          </Link>
        </div>
      )}

      {status === "notfound" && (
        <div className="text-center">
          <FailedMark />
          <h1 className="font-display font-extrabold text-3xl mb-3">
            We couldn't find this payment
          </h1>
          <p className="text-ink/70 leading-relaxed mb-8">
            The link may be old or mistyped. If you've already paid, use the phone number and
            tracking code you were given to find your order.
          </p>
          <Link to="/cart" className={primaryBtn}>
            Back to cart
          </Link>
        </div>
      )}

      {/* Daraja confirmed: the order exists now */}
      {status === "confirmed" && result.order && (
        <ConfirmedOrder order={result.order} />
      )}
    </div>
  );
};

const ConfirmedOrder = ({ order }) => {
  const firstName = (order.customerName || "").trim().split(" ")[0];
  const pickup =
    order.pickupLocation === "Custom"
      ? order.customLocation || "Custom location"
      : order.pickupLocation;
  const trackPath = `/track?phone=${encodeURIComponent(order.customerPhone)}&code=${order.trackingCode}`;

  return (
    <div className="text-center">
      <ConfirmedMark />
      <h1 className="font-display font-extrabold text-4xl mb-1">Asante sana! Order confirmed</h1>
      <p className="text-ink/70 leading-relaxed mb-10">
        {firstName ? `Thanks, ${firstName}. ` : ""}We've received your M-Pesa payment of{" "}
        {money(order.totalAmount)}.
      </p>

      {/* Tracking code + M-Pesa receipt — the two things the customer must keep */}
      <div className="kanga-frame bg-sun-300 rounded-2xl shadow-pop px-6 py-9 mb-8">
        <p className="text-ink/60 text-sm mb-1">Your tracking code</p>
        <p
          className="font-display text-6xl font-extrabold text-ink tracking-[0.2em] pl-[0.2em] mb-6"
          aria-label={`Tracking code ${String(order.trackingCode).split("").join(" ")}`}
        >
          {order.trackingCode}
        </p>

        {order.receipt && (
          <>
            <p className="text-ink/60 text-sm mb-1">M-Pesa receipt</p>
            <p className="font-display text-2xl text-ink mb-6 break-all">{order.receipt}</p>
          </>
        )}

        <p className="text-ink/60 text-sm">
          Use tracking code <strong>{order.trackingCode}</strong> with phone{" "}
          <strong>{order.customerPhone}</strong> on the Track Order page.
        </p>
      </div>

      <div className="text-left mb-10">
        <h2 className="font-display font-extrabold text-2xl mb-2">Order details</h2>
        <ul className="divide-y divide-ink/15 border-y-2 border-ink/20 mb-2">
          {(order.items || []).map((it, i) => (
            <li key={i} className="flex justify-between gap-6 py-2 text-sm">
              <span className="text-ink min-w-0 break-words">
                {it.quantity} × {it.name}
              </span>
              <span className="text-ink/70 shrink-0">{money(it.price * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl>
          <Row label="Total paid">{money(order.totalAmount)}</Row>
          <Row label="Pickup">{pickup}</Row>
          {order.receipt && <Row label="M-Pesa receipt">{order.receipt}</Row>}
        </dl>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to={trackPath} className={primaryBtn}>
          Track this order
        </Link>
        <Link to="/" className={secondaryBtn}>
          Keep shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
